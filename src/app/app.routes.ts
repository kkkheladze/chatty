import { inject } from '@angular/core';
import { Routes } from '@angular/router';

import { AuthService } from './core/services/auth.service';

export default [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component'),
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.component'),
  },
  {
    path: '',
    canMatch: [() => inject(AuthService).authGuard()],
    loadChildren: () => import('./pages/main/main.routes'),
  },
] as Routes;
