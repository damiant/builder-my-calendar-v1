import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentService } from '../../services/appointment.service';
import { Appointment, AppointmentCategory } from '../../models/appointment.model';
import { AppointmentModalComponent } from '../../components/appointment-modal/appointment-modal.component';
import { OfflineIndicatorComponent } from '../../components/offline-indicator/offline-indicator.component';
import { NzCalendarModule } from 'ng-zorro-antd/calendar';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FormsModule } from '@angular/forms';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@Component({
  selector: 'app-calendar-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AppointmentModalComponent,
    OfflineIndicatorComponent,
    NzCalendarModule,
    NzBadgeModule,
    NzButtonModule,
    NzIconModule,
    NzSelectModule,
    NzSpinModule,
  ],
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.css'],
})
export class CalendarPage {
  appointmentService = inject(AppointmentService);

  isModalVisible = signal<boolean>(false);
  editingAppointment = signal<Appointment | null>(null);
  selectedDate = signal<Date>(new Date());

  onDateSelect(date: Date): void {
    this.selectedDate.set(date);
  }

  getAppointments(date: Date): Appointment[] {
    return this.appointmentService.getAppointmentsForDate(date);
  }

  openCreateModal(date?: Date): void {
    if (date) {
      this.selectedDate.set(date);
    }
    this.editingAppointment.set(null);
    this.isModalVisible.set(true);
  }

  openEditModal(event: MouseEvent, appointment: Appointment): void {
    event.stopPropagation();
    this.editingAppointment.set(appointment);
    this.isModalVisible.set(true);
  }

  onSaveAppointment(data: Partial<Appointment>): void {
    const current = this.editingAppointment();
    if (current) {
      this.appointmentService.updateAppointment(current.id, data);
    } else {
      this.appointmentService.addAppointment({
        ...data,
        startDate: data.startDate || this.selectedDate().toISOString(),
      });
    }
  }

  onDeleteAppointment(id: string): void {
    this.appointmentService.deleteAppointment(id);
  }

  onCategoryChange(categories: AppointmentCategory[]): void {
    this.appointmentService.setSelectedCategories(categories);
  }
}
