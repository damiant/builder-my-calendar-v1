export type AppointmentCategory = 'work' | 'home';

export interface Appointment {
  id: string;
  title: string;
  startDate: string; // ISO 8601
  endDate?: string; // ISO 8601
  allDay: boolean;
  category: AppointmentCategory;
  notes?: string;
  syncStatus?: 'synced' | 'pending' | 'error';
  updatedAt: string; // ISO 8601
}

export interface PendingOperation {
  id: string;
  type: 'create' | 'update' | 'delete';
  appointmentId: string;
  payload: Appointment | Partial<Appointment>;
  timestamp: string;
  retryCount: number;
}

export function generateUUID(): string {
  return crypto.randomUUID();
}

export function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function createAppointment(data: Partial<Appointment>): Appointment {
  const now = new Date().toISOString();
  return {
    id: data.id || generateUUID(),
    title: data.title || '',
    startDate: data.startDate || now,
    endDate: data.endDate,
    allDay: data.allDay ?? false,
    category: data.category || 'work',
    notes: data.notes,
    syncStatus: data.syncStatus || 'synced',
    updatedAt: now,
    ...data,
  };
}
