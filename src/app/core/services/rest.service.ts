import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { delay, of } from 'rxjs';
import { Conversation } from '../models/conversation';
import { User } from '../models/user';

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

  refreshToken() {
    return this.http.post<string>('/api/auth/refresh-token', {}, { responseType: 'text' as any });
  }

  logout() {
    // return this.http.post<void>('/api/auth/logout', {});
    return of(null).pipe(delay(500));
  }

  getAllConversations() {
    return this.http.get<Conversation[]>('/api/conversations');
  }

  getUsersByQuery(search: string) {
    return this.http.get<User[]>(`/api/users?search=${search}`);
  }
}
