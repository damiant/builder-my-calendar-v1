import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SyncService } from '../../services/sync.service';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

@Component({
  selector: 'app-sync-status',
  standalone: true,
  imports: [CommonModule, NzIconModule, NzToolTipModule],
  template: `
    <div class="sync-status" [nz-tooltip]="tooltipTemplate">
      @if (syncService.isSyncing()) {
      <span nz-icon nzType="sync" [nzSpin]="true" class="syncing"></span>
      } @else if (syncService.pendingCount() > 0) {
      <span nz-icon nzType="cloud-upload" class="pending"></span>
      <span class="count">{{ syncService.pendingCount() }}</span>
      } @else {
      <span nz-icon nzType="cloud" class="synced"></span>
      }
    </div>

    <ng-template #tooltipTemplate>
      @if (syncService.isSyncing()) { Syncing changes... } @else if (syncService.pendingCount() > 0)
      { {{ syncService.pendingCount() }} changes waiting to sync } @else { All changes synced }
    </ng-template>
  `,
  styles: [
    `
      .sync-status {
        display: flex;
        align-items: center;
        gap: var(--spacing-xs);
        padding: var(--spacing-xs) var(--spacing-sm);
        border-radius: var(--radius-full);
        background-color: var(--color-background-subtle);
        cursor: help;
        font-size: 14px;
      }

      .syncing {
        color: var(--color-primary);
      }

      .pending {
        color: #f59e0b; /* Amber-500 */
      }

      .synced {
        color: var(--color-primary);
      }

      .count {
        font-weight: 600;
        font-size: 12px;
      }
    `,
  ],
})
export class SyncStatusComponent {
  syncService = inject(SyncService);
}
