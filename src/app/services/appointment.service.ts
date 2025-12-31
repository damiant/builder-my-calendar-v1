import { Injectable, inject, signal, computed } from '@angular/core';
import {
  Appointment,
  AppointmentCategory,
  createAppointment,
  generateUUID,
  formatDateKey,
} from '../models/appointment.model';
import { StorageService } from './storage.service';
import { SyncService } from './sync.service';
import { NetworkService } from './network.service';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private storageService = inject(StorageService);
  private syncService = inject(SyncService);
  private networkService = inject(NetworkService);

  // Core State
  private readonly _appointments = signal<Appointment[]>([]);
  readonly appointments = this._appointments.asReadonly();

  // Filters
  readonly selectedCategories = signal<AppointmentCategory[]>(['work', 'home']);

  // Loading & Error Status
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  // Computed Values
  readonly filteredAppointments = computed(() => {
    const categories = this.selectedCategories();
    return this._appointments().filter((app) => categories.includes(app.category));
  });

  readonly appointmentsByDate = computed(() => {
    const map = new Map<string, Appointment[]>();
    this.filteredAppointments().forEach((app) => {
      const dateKey = formatDateKey(new Date(app.startDate));
      if (!map.has(dateKey)) {
        map.set(dateKey, []);
      }
      map.get(dateKey)!.push(app);
    });
    return map;
  });

  constructor() {
    this.initialize();
  }

  private async initialize() {
    this.loading.set(true);
    try {
      const stored = await this.storageService.loadAllAppointments();
      if (stored.length === 0) {
        await this.seedData();
      } else {
        this._appointments.set(stored);
      }
    } catch (err) {
      this.error.set('Failed to load appointments');
      console.error(err);
    } finally {
      this.loading.set(false);
    }
  }

  async addAppointment(data: Partial<Appointment>): Promise<void> {
    const appointment = createAppointment({
      ...data,
      syncStatus: this.networkService.isOnline() ? 'synced' : 'pending',
    });

    // Optimistic Update
    this._appointments.update((prev) => [...prev, appointment]);

    // Persist to Storage
    await this.storageService.saveAppointment(appointment);

    // Queue for Sync
    await this.syncService.queueOperation({
      id: generateUUID(),
      type: 'create',
      appointmentId: appointment.id,
      payload: appointment,
      timestamp: new Date().toISOString(),
      retryCount: 0,
    });
  }

  async updateAppointment(id: string, updates: Partial<Appointment>): Promise<void> {
    const current = this._appointments().find((a) => a.id === id);
    if (!current) return;

    const updated: Appointment = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString(),
      syncStatus: this.networkService.isOnline() ? 'synced' : 'pending',
    };

    // Optimistic Update
    this._appointments.update((prev) => prev.map((a) => (a.id === id ? updated : a)));

    // Persist to Storage
    await this.storageService.saveAppointment(updated);

    // Queue for Sync
    await this.syncService.queueOperation({
      id: generateUUID(),
      type: 'update',
      appointmentId: id,
      payload: updated,
      timestamp: new Date().toISOString(),
      retryCount: 0,
    });
  }

  async deleteAppointment(id: string): Promise<void> {
    const current = this._appointments().find((a) => a.id === id);
    if (!current) return;

    // Optimistic Update
    this._appointments.update((prev) => prev.filter((a) => a.id !== id));

    // Persist to Storage
    await this.storageService.deleteAppointment(id);

    // Queue for Sync
    await this.syncService.queueOperation({
      id: generateUUID(),
      type: 'delete',
      appointmentId: id,
      payload: { id },
      timestamp: new Date().toISOString(),
      retryCount: 0,
    });
  }

  getAppointmentsForDate(date: Date): Appointment[] {
    const key = formatDateKey(date);
    return this.appointmentsByDate().get(key) || [];
  }

  setSelectedCategories(categories: AppointmentCategory[]): void {
    this.selectedCategories.set(categories);
  }

  private async seedData() {
    const now = new Date();
    const samples: Appointment[] = [
      createAppointment({
        title: 'Work Meeting',
        startDate: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 0).toISOString(),
        category: 'work',
        notes: 'Discussion about the project',
      }),
      createAppointment({
        title: 'Gym Session',
        startDate: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 17, 30).toISOString(),
        category: 'home',
      }),
      createAppointment({
        title: 'Dinner with friends',
        startDate: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 1,
          19,
          0,
        ).toISOString(),
        category: 'home',
      }),
      createAppointment({
        title: 'Project Deadline',
        startDate: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 2,
          9,
          0,
        ).toISOString(),
        category: 'work',
        allDay: true,
      }),
    ];

    for (const app of samples) {
      await this.storageService.saveAppointment(app);
    }
    this._appointments.set(samples);
  }
}
