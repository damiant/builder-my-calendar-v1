import { Component, inject, input, output, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { Appointment, AppointmentCategory } from '../../models/appointment.model';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NetworkService } from '../../services/network.service';

@Component({
  selector: 'app-appointment-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    NzDatePickerModule,
    NzTimePickerModule,
    NzSelectModule,
    NzSwitchModule,
    NzCheckboxModule,
    NzButtonModule,
    NzIconModule,
  ],
  templateUrl: './appointment-modal.component.html',
  styleUrls: ['./appointment-modal.component.css'],
})
export class AppointmentModalComponent {
  private fb = inject(FormBuilder);
  networkService = inject(NetworkService);

  visible = input.required<boolean>();
  appointment = input<Appointment | null>(null);
  defaultDate = input<Date>(new Date());

  visibleChange = output<boolean>();
  save = output<Partial<Appointment>>();
  delete = output<string>();

  form: FormGroup;

  constructor() {
    this.form = this.fb.group({
      title: ['', [Validators.required]],
      startDate: [null, [Validators.required]],
      startTime: [null],
      allDay: [false],
      category: ['work', [Validators.required]],
      notes: [''],
    });

    effect(() => {
      const app = this.appointment();
      if (app) {
        this.form.patchValue({
          title: app.title,
          startDate: new Date(app.startDate),
          startTime: app.allDay ? null : new Date(app.startDate),
          allDay: app.allDay,
          category: app.category,
          notes: app.notes,
        });
      } else {
        this.form.reset({
          category: 'work',
          allDay: false,
          startDate: this.defaultDate(),
        });
      }
    });
  }

  handleCancel(): void {
    this.visibleChange.emit(false);
  }

  handleOk(): void {
    if (this.form.valid) {
      const val = this.form.value;
      const startDate = new Date(val.startDate);

      if (!val.allDay && val.startTime) {
        const time = new Date(val.startTime);
        startDate.setHours(time.getHours());
        startDate.setMinutes(time.getMinutes());
      } else {
        startDate.setHours(0, 0, 0, 0);
      }

      this.save.emit({
        title: val.title,
        startDate: startDate.toISOString(),
        allDay: val.allDay,
        category: val.category,
        notes: val.notes,
      });
      this.visibleChange.emit(false);
    } else {
      Object.values(this.form.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  handleDelete(): void {
    const app = this.appointment();
    if (app) {
      this.delete.emit(app.id);
      this.visibleChange.emit(false);
    }
  }
}
