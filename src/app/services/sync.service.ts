import { Injectable, inject, signal, effect } from '@angular/core';
import { StorageService } from './storage.service';
import { NetworkService } from './network.service';
import { PendingOperation } from '../models/appointment.model';

@Injectable({
  providedIn: 'root',
})
export class SyncService {
  private storageService = inject(StorageService);
  private networkService = inject(NetworkService);

  readonly isSyncing = signal<boolean>(false);
  readonly pendingCount = signal<number>(0);

  constructor() {
    // Attempt to sync when back online
    effect(() => {
      if (this.networkService.isOnline()) {
        this.flushQueue();
      }
    });

    this.updatePendingCount();
  }

  async queueOperation(op: PendingOperation): Promise<void> {
    await this.storageService.queueOperation(op);
    await this.updatePendingCount();

    if (this.networkService.isOnline()) {
      this.flushQueue();
    }
  }

  async flushQueue(): Promise<void> {
    if (this.isSyncing() || !this.networkService.isOnline()) return;

    const ops = await this.storageService.getPendingOperations();
    if (ops.length === 0) return;

    this.isSyncing.set(true);

    try {
      for (const op of ops) {
        // Mock API call
        console.log(`Syncing operation: ${op.type} for ${op.appointmentId}`);
        await new Promise((resolve) => setTimeout(resolve, 500));

        // On success, remove from queue
        await this.storageService.removePendingOperation(op.id);
        console.log(`Successfully synced: ${op.id}`);
      }
    } catch (error) {
      console.error('Failed to flush sync queue', error);
    } finally {
      this.isSyncing.set(false);
      await this.updatePendingCount();
    }
  }

  private async updatePendingCount(): Promise<void> {
    const ops = await this.storageService.getPendingOperations();
    this.pendingCount.set(ops.length);
  }
}
