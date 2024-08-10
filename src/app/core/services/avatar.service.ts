import { EventEmitter, inject, Injectable, signal } from '@angular/core';
import { catchError, map, of, tap } from 'rxjs';
import { RestService } from './rest.service';

@Injectable({
  providedIn: 'root',
})
export class AvatarService {
  private restService = inject(RestService);

  cache = new Map<string, string | '404'>();
  avatarUploaded = new EventEmitter<string | null>(); // Emits user ID

  getUserAvatar(id: string) {
    const avatar = this.cache.get(id);
    if (avatar === '404') return of(undefined);
    if (avatar) return of(avatar);
    this.cache.set(id, '404');
    return this.restService.getAvatar(id).pipe(
      map((buffer) => {
        const blob = new Blob([buffer], { type: 'image/webp' });
        return this.saveToCache(id, blob);
      }),
      catchError(() => of(undefined))
    );
  }

  uploadAvatar(id: string, avatar: Blob) {
    return this.restService.uploadAvatar(avatar).pipe(
      tap(() => {
        this.saveToCache(id, avatar);
        this.avatarUploaded.emit(id);
      })
    );
  }

  private saveToCache(id: string, avatar: Blob) {
    const url = URL.createObjectURL(avatar);
    this.cache.set(id, url);
    return url;
  }
}
