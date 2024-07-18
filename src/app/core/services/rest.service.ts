import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { delay, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RestService {
  private http = inject(HttpClient);

  login<T>(credentials: T) {
    return this.http.post<string>('/api/auth/login', credentials, { responseType: 'text' as any });
  }

  register<T>(user: T) {
    return this.http.post<string>('/api/auth/register', user, { responseType: 'text' as any });
  }

  logout() {
    // return this.http.post<void>('/api/auth/logout', {});
    return of(null).pipe(delay(500));
  }
}
