import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SyncStatusComponent } from './components/sync-status/sync-status.component';
import { UpdateService } from './services/update.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SyncStatusComponent, NzButtonModule, NzIconModule, NzToolTipModule],
  templateUrl: './app.html',
})
export class App {
  updateService = inject(UpdateService);
  protected readonly title = signal('My Calendar');
}
