import { inject, Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { catchError, map, of, tap } from 'rxjs';
import { RestService } from './rest.service';

@Injectable({
  providedIn: 'root',
})
export class AvatarService {
  private restService = inject(RestService);
  private sanitizer = inject(DomSanitizer);

  cache = new Map<string, string>();

  getUserAvatar(id: string) {
    const avatar = this.cache.get(id);
    if (avatar) return of(avatar);

    return this.restService.getUserAvatar(id).pipe(
      map((buffer) => {
        const blob = new Blob([buffer], { type: 'image/jpeg' });
        const url = URL.createObjectURL(blob);
        this.cache.set(id, this.sanitizer.bypassSecurityTrustUrl(url) as string);
        return url;
      }),
      catchError(() => of(undefined))
    );
  }

  uploadAvatar(id: string, avatar: File) {
    return this.restService.uploadUserAvatar(avatar).pipe(
      tap((avatar) => {
        // this.cache.set(id,URL.createObjectURL() )
        // this.cache.set(this.authService.session()!._id, avatar);
      })
    );
  }
}
