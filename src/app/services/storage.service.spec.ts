import 'zone.js';
import 'zone.js/testing';
import { TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { StorageService } from './storage.service';
import * as idbKeyval from 'idb-keyval';
import { Appointment } from '../models/appointment.model';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Initialize the Angular testing environment
try {
  TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());
} catch (e) {
  // Environment already initialized
}

// Mock idb-keyval
vi.mock('idb-keyval', () => {
  return {
    createStore: vi.fn(),
    set: vi.fn(),
    get: vi.fn(),
    del: vi.fn(),
    entries: vi.fn(),
    clear: vi.fn(),
  };
});

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
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
      syncStatus: 'synced',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await service.saveAppointment(appointment);

    expect(idbKeyval.set).toHaveBeenCalledWith(
      appointment.id,
      appointment,
      expect.anything() // this.appointmentsStore
    );
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
    expect(idbKeyval.del).toHaveBeenCalledWith('1', expect.anything());
  });
});
