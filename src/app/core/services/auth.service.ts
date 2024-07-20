import { inject, Injectable, signal } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { catchError, EMPTY, tap } from 'rxjs';

import { UserDTO } from '../models/user';
import { RestService } from './rest.service';

type Session = { expiresAt: number; issuedAt: number; _id: string; email: string; name: string; lastName: string };

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private jwt = inject(JwtHelperService);
  private router = inject(Router);
  private restService = inject(RestService);

  private readonly TOKEN_KEY = 'accessToken';
  session = signal<Session | null>(null);

  constructor() {
    const accessToken = this.tokenGetter();
    accessToken && this.setSession(accessToken);
  }

  login(credentials: { email: string; password: string }) {
    return this.restService.login(credentials).pipe(tap((response) => this.setSession(response)));
  }

  register(user: UserDTO) {
    return this.restService.register(user).pipe(tap((response) => this.setSession(response)));
  }

  refreshToken() {
    return this.restService.refreshToken().pipe(
      tap((response) => this.setSession(response)),
      catchError((error) => {
        this.logout();
        throw error;
      })
    );
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    this.session.set(null);
    this.router.navigate(['/login']);
    this.restService.logout().subscribe();
  }

  isLoggedIn(): boolean {
    const accessToken = this.tokenGetter();
    return !!(accessToken && !this.jwt.isTokenExpired(accessToken));
  }

  authGuard(): boolean | UrlTree {
    return this.isLoggedIn() || this.router.createUrlTree(['/login']);
  }

  tokenGetter(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private setSession(accessToken: string): void {
    localStorage.setItem(this.TOKEN_KEY, accessToken);
    const decoded = this.jwt.decodeToken(accessToken);
    this.session.set(decoded);
  }
}
