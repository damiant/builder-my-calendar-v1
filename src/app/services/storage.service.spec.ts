import 'zone.js';
import 'zone.js/testing';
import { TestBed } from '@angular/core/testing';
import { StorageService } from './storage.service';
import * as idbKeyval from 'idb-keyval';
import { Appointment } from '../models/appointment.model';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock idb-keyval BEFORE importing the service if possible, 
// but vitest hoisting should handle this.
vi.mock('idb-keyval', () => {
  const mockStore = {};
  return {
    createStore: vi.fn(() => mockStore),
    set: vi.fn().mockResolvedValue(undefined),
    get: vi.fn().mockResolvedValue(undefined),
    del: vi.fn().mockResolvedValue(undefined),
    entries: vi.fn().mockResolvedValue([]),
    clear: vi.fn().mockResolvedValue(undefined),
  };
});

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    // Mock global indexedDB to avoid ReferenceError if some code still tries to access it
    if (typeof global !== 'undefined' && !(global as any).indexedDB) {
      (global as any).indexedDB = {};
    }

    TestBed.configureTestingModule({
      providers: [StorageService]
    });
    service = TestBed.inject(StorageService);
    vi.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call idb-keyval set when saving an appointment', async () => {
    const appointment: Appointment = {
      id: '1',
      title: 'Test',
      startDate: new Date().toISOString(),
      category: 'work',
      allDay: false,
      syncStatus: 'synced',
      updatedAt: new Date().toISOString(),
    };

    await service.saveAppointment(appointment);

    expect(idbKeyval.set).toHaveBeenCalled();
  });

  it('should call idb-keyval entries when loading appointments', async () => {
    const mockEntries: [string, Appointment][] = [
      ['1', { id: '1', title: 'Test' } as Appointment]
    ];
    (idbKeyval.entries as any).mockResolvedValue(mockEntries);

    const result = await service.loadAllAppointments();

    expect(idbKeyval.entries).toHaveBeenCalled();
    expect(result).toEqual([{ id: '1', title: 'Test' }]);
  });

  it('should call idb-keyval del when deleting an appointment', async () => {
    await service.deleteAppointment('1');
    expect(idbKeyval.del).toHaveBeenCalled();
  });
});
