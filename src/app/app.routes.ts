import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

export default [
  {
    path: 'login',
    title: 'Chatty - Login',
    loadComponent: () => import('./pages/login/login.component'),
  },
  {
    path: 'register',
    title: 'Chatty - Register',
    loadComponent: () => import('./pages/register/register.component'),
  },
  {
    path: '',
    title: 'Chatty',
    canMatch: [() => inject(AuthService).authGuard()],
    loadChildren: () => import('./pages/main/main.routes'),
  },
] as Routes;
