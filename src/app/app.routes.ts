import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'calendar',
    pathMatch: 'full',
  },
  {
    path: 'calendar',
    loadComponent: () =>
      import('./pages/calendar/calendar.page').then((m) => m.CalendarPage),
  },
];
