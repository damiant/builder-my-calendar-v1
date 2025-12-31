import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Appointment } from '../../models/appointment.model';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-appointment-card',
  standalone: true,
  imports: [CommonModule, NzButtonModule],
  templateUrl: './appointment-card.component.html',
  styleUrl: './appointment-card.component.css',
})
export class AppointmentCardComponent {
  appointment = input.required<Appointment>();

  reschedule = output<Appointment>();
  cardClick = output<Appointment>();

  getDayOfWeek(): string {
    const date = new Date(this.appointment().startDate);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
  }

  getFormattedTime(): string {
    const date = new Date(this.appointment().startDate);
    if (this.appointment().allDay) {
      return 'All Day';
    }
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }

  onRescheduleClick(event: Event): void {
    event.stopPropagation();
    this.reschedule.emit(this.appointment());
  }

  onCardClick(): void {
    this.cardClick.emit(this.appointment());
  }
}
