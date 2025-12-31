import { Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentService } from '../../services/appointment.service';
import { Appointment } from '../../models/appointment.model';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';

interface WeekAppointment {
  day: string;
  time: string;
  name: string;
  type: string;
  category: 'work' | 'home';
  appointment: Appointment;
}

@Component({
  selector: 'app-planner',
  standalone: true,
  imports: [CommonModule, NzButtonModule, NzCardModule],
  templateUrl: './planner.component.html',
  styleUrls: ['./planner.component.css'],
})
export class PlannerComponent {
  appointmentService = inject(AppointmentService);

  selectedDate = input<Date>(new Date());
  edit = output<Appointment>();

  getWeekAppointments(): WeekAppointment[] {
    const weekAppointments: WeekAppointment[] = [];
    const appointments = this.appointmentService.filteredAppointments();

    const daysOfWeek = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];

    appointments.forEach((appointment) => {
      const date = new Date(appointment.startDate);
      const dayName = daysOfWeek[date.getDay()];
      const time = this.formatTime(date);

      weekAppointments.push({
        day: dayName,
        time: time,
        name: appointment.title,
        type: appointment.notes || '',
        category: appointment.category,
        appointment: appointment,
      });
    });

    // Sort by date
    weekAppointments.sort((a, b) => {
      const dateA = new Date(a.appointment.startDate);
      const dateB = new Date(b.appointment.startDate);
      return dateA.getTime() - dateB.getTime();
    });

    return weekAppointments;
  }

  formatTime(date: Date): string {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, '0');
    return `${displayHours}:${displayMinutes} ${ampm}`;
  }

  onReschedule(appointment: Appointment): void {
    this.edit.emit(appointment);
  }
}
