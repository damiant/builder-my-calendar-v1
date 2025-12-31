import { Injectable } from '@angular/core';
import { get, set, createStore, del, entries, clear } from 'idb-keyval';
import { Appointment, PendingOperation } from '../models/appointment.model';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private appointmentsStore = createStore('appointments-db', 'appointments');
  private operationsStore = createStore('operations-db', 'operations');

  // Constructor intentionally empty - no initialization needed

  // Appointments
  async loadAllAppointments(): Promise<Appointment[]> {
    try {
      const allEntries = await entries<string, Appointment>(this.appointmentsStore);
      return allEntries.map(([, appointment]) => appointment);
    } catch (error) {
      console.error('Failed to load appointments from IndexedDB', error);
      return [];
    }
  }

  async saveAppointment(appointment: Appointment): Promise<void> {
    try {
      await set(appointment.id, appointment, this.appointmentsStore);
      console.log(`[StorageService] Appointment saved to IndexedDB: ${appointment.id}`);
    } catch (error) {
      console.error('Failed to save appointment to IndexedDB', error);
      throw error;
    }
  }

  async getAppointmentById(id: string): Promise<Appointment | undefined> {
    try {
      return await get<Appointment>(id, this.appointmentsStore);
    } catch (error) {
      console.error('Failed to get appointment from IndexedDB', error);
      return undefined;
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
      return allEntries.map(([, op]) => op).sort((a, b) => a.timestamp.localeCompare(b.timestamp));
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
