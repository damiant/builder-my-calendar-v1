import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NetworkService } from '../../services/network.service';
import { SyncService } from '../../services/sync.service';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-offline-indicator',
  standalone: true,
  imports: [CommonModule, NzAlertModule, NzIconModule],
  template: `
    @if (!networkService.isOnline()) {
    <div class="offline-banner">
      <nz-alert
        nzType="warning"
        [nzMessage]="offlineMessage"
        nzShowIcon
        [nzDescription]="offlineDescription"
      >
        <ng-template #offlineMessage>
          <span class="banner-title">You are currently offline</span>
        </ng-template>
        <ng-template #offlineDescription>
          Your changes will be saved locally and synced automatically when you are back online.
          @if (syncService.pendingCount() > 0) {
          <div class="pending-count">
            <strong>{{ syncService.pendingCount() }}</strong> pending changes waiting to sync.
          </div>
          }
        </ng-template>
      </nz-alert>
    </div>
    }
  `,
  styles: [
    `
      .offline-banner {
        width: 100%;
        margin-bottom: var(--spacing-md);
        animation: slideDown 0.3s ease-out;
      }

      .banner-title {
        font-weight: 600;
      }

      .pending-count {
        margin-top: var(--spacing-xs);
      }

      @keyframes slideDown {
        from {
          transform: translateY(-20px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
    `,
  ],
})
export class OfflineIndicatorComponent {
  networkService = inject(NetworkService);
  syncService = inject(SyncService);
}
