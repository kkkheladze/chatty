import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { delay, of } from 'rxjs';
import { Chat, ChatDTO } from '../models/chat';
import { Credentials, User, UserDTO } from '../models/user';
import { Message, MessageDTO } from '../models/message';

@Injectable({
  providedIn: 'root',
})
export class RestService {
  private http = inject(HttpClient);

  /**
   * @param credentials - The user's login credentials.
   * @returns Access token as a string and HTTP only secure cookie
   */
  login(credentials: Credentials) {
    return this.http.post<string>('/api/auth/login', credentials, { responseType: 'text' as any });
  }

  /**
   * @param user - The user's registration details.
   * @returns Access token as a string and HTTP only secure cookie
   */
  register(user: UserDTO) {
    return this.http.post<string>('/api/auth/register', user, { responseType: 'text' as any });
  }

  /**
   * Refreshes the user's authentication token.
   * @returns Access token as a string and HTTP only secure cookie
   */
  refreshToken() {
    return this.http.post<string>('/api/auth/refresh-token', {}, { responseType: 'text' as any });
  }

  /**
   * Logs out the user.
   * @returns An observable that emits null after a delay of 500 milliseconds.
   */
  logout() {
    // return this.http.post<void>('/api/auth/logout', {});
    return of(null).pipe(delay(500));
  }

  /**
   * @param populate - A boolean indicating whether to populate the chat data (ex. users).
   * @returns A promise that resolves to an array of Chat objects.
   */
  getChats(populate: boolean = true) {
    const params = new HttpParams().set('populate', populate);
    return this.http.get<Chat[]>(`/api/chats`, { params });
  }

  /**
   * @param chat - The new chat details.
   * @returns A promise that resolves to a Chat object representing the created chat.
   */
  createChat(chat: ChatDTO) {
    return this.http.post<Chat>('/api/chats', chat);
  }

  /**
   * Retrieves users based on a search query.
   * @param search - The search query.
   * @param excludeSelf - A boolean indicating whether to exclude the current user from the search results.
   * @returns A promise that resolves to an array of User objects matching the search query.
   */
  getUsersByQuery(search: string, excludeSelf: boolean = true) {
    const params = new HttpParams().set('search', search).set('excludeSelf', excludeSelf);
    return this.http.get<User[]>(`/api/users`, { params });
  }

  /**
   * Retrieves the avatar of a user.
   * @param userId - The ID of the user.
   * @returns A promise that resolves to an ArrayBuffer representing the user's avatar.
   */
  getAvatar(userId: string) {
    const params = new HttpParams().set('id', userId);
    return this.http.get<ArrayBuffer>(`/api/avatars`, { params, responseType: 'arrayBuffer' as any });
  }

  /**
   * Uploads a user's avatar.
   * @param avatar - The avatar file to upload.
   * @returns A promise that resolves when the avatar is successfully uploaded.
   */
  uploadAvatar(avatar: Blob) {
    const formData = new FormData();
    formData.append('avatar', avatar);
    return this.http.post<void>('/api/avatars', formData);
  }

  /**
   * Deletes a user's avatar.
   * @returns A promise that resolves when the avatar is successfully deleted.
   */
  deleteAvatar() {
    return this.http.delete<void>(`/api/avatars`);
  }

  /**
   * Retrieves messages from a chat.
   * @param chatId - A path parameter of the ID of the chat.
   * @param limit - A query parameter of the maximum number of messages to retrieve.
   * @param offset - A query parameter of the number of messages to skip.
   * @returns A promise that resolves to an array of Message objects.
   */
  getMessages(chatId: string, limit: number = 50, offset: number = 0) {
    const params = new HttpParams().set('limit', limit).set('offset', offset);
    return this.http.get<Message[]>(`/api/chats/${chatId}/messages`, { params });
  }

  sendMessage(chatId: string, message: MessageDTO) {
    return this.http.post<Message>(`/api/chats/${chatId}/messages`, message);
  }
}
