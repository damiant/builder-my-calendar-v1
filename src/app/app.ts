import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SyncStatusComponent } from './components/sync-status/sync-status.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SyncStatusComponent],
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('My Calendar');
}
