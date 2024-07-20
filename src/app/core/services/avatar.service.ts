import { inject, Injectable } from '@angular/core';
import { catchError, map, of, tap } from 'rxjs';
import { RestService } from './rest.service';

@Injectable({
  providedIn: 'root',
})
export class AvatarService {
  private restService = inject(RestService);

  cache = new Map<string, string | '404'>();

  getUserAvatar(id: string) {
    const avatar = this.cache.get(id);
    if (avatar === '404') return of(undefined);
    if (avatar) return of(avatar);
    this.cache.set(id, '404');
    return this.restService.getAvatar(id).pipe(
      map((buffer) => {
        const blob = new Blob([buffer], { type: 'image/jpeg' });
        const url = URL.createObjectURL(blob);
        this.cache.set(id, url);
        return url;
      }),
      catchError(() => of(undefined))
    );
  }

  uploadAvatar(id: string, avatar: File) {
    return this.restService.uploadAvatar(avatar).pipe(
      tap((avatar) => {
        // this.cache.set(id,URL.createObjectURL() )
        // this.cache.set(this.authService.session()!._id, avatar);
      })
    );
  }
}
