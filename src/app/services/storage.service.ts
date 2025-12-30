import { Injectable } from '@angular/core';
import { get, set, createStore, del, entries, clear } from 'idb-keyval';
import { Appointment, PendingOperation } from '../models/appointment.model';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private appointmentsStore = createStore('calendar-db', 'appointments');
  private operationsStore = createStore('calendar-db', 'pending-ops');

  constructor() {}

  // Appointments
  async loadAllAppointments(): Promise<Appointment[]> {
    try {
      const allEntries = await entries<string, Appointment>(this.appointmentsStore);
      return allEntries.map(([_, appointment]) => appointment);
    } catch (error) {
      console.error('Failed to load appointments from IndexedDB', error);
      return [];
    }
  }

  async saveAppointment(appointment: Appointment): Promise<void> {
    try {
      await set(appointment.id, appointment, this.appointmentsStore);
    } catch (error) {
      console.error('Failed to save appointment to IndexedDB', error);
      throw error;
    }
  }

  async deleteAppointment(id: string): Promise<void> {
    try {
      await del(id, this.appointmentsStore);
    } catch (error) {
      console.error('Failed to delete appointment from IndexedDB', error);
      throw error;
    }
  }

  // Operations Queue
  async getPendingOperations(): Promise<PendingOperation[]> {
    try {
      const allEntries = await entries<string, PendingOperation>(this.operationsStore);
      return allEntries
        .map(([_, op]) => op)
        .sort((a, b) => a.timestamp.localeCompare(b.timestamp));
    } catch (error) {
      console.error('Failed to load pending operations from IndexedDB', error);
      return [];
    }
  }

  async queueOperation(operation: PendingOperation): Promise<void> {
    try {
      await set(operation.id, operation, this.operationsStore);
    } catch (error) {
      console.error('Failed to queue operation in IndexedDB', error);
      throw error;
    }
  }

  async removePendingOperation(id: string): Promise<void> {
    try {
      await del(id, this.operationsStore);
    } catch (error) {
      console.error('Failed to remove pending operation from IndexedDB', error);
      throw error;
    }
  }

  async clearAll(): Promise<void> {
    await clear(this.appointmentsStore);
    await clear(this.operationsStore);
  }
}
