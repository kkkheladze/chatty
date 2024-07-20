import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { delay, of } from 'rxjs';
import { Conversation, ConversationDTO } from '../models/conversation';
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

  getAllConversations(populate: boolean = true) {
    const params = new HttpParams().set('populate', populate);
    return this.http.get<Conversation[]>(`/api/conversations`, { params });
  }

  createConversation(conversation: ConversationDTO) {
    return this.http.post<Conversation>('/api/conversations', conversation);
  }

  getUsersByQuery(search: string, excludeSelf: boolean = true) {
    const params = new HttpParams().set('search', search).set('excludeSelf', excludeSelf);
    return this.http.get<User[]>(`/api/users`, { params });
  }

  getUserAvatar(id: string) {
    const params = new HttpParams().set('id', id);
    return this.http.get<ArrayBuffer>(`/api/avatars`, { params, responseType: 'arrayBuffer' as any });
  }

  uploadUserAvatar(avatar: File) {
    const formData = new FormData();
    formData.append('avatar', avatar);
    return this.http.post<void>('/api/users/avatar', formData);
  }
}
