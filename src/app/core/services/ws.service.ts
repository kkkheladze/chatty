import { effect, inject, Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class WsService extends Socket {
  private authService = inject(AuthService);

  constructor() {
    super({ url: environment.WS_URL, options: { autoConnect: false } });
    effect(() => {
      const session = this.authService.session();
      this.updateToken();
      if (session) {
        this.connect();
      } else this.disconnect();
    });
  }

  sendMessage(eventName: string, data: any) {
    this.emit(eventName, data);
  }

  getSocket<T>(eventName: string) {
    return this.fromEvent<T>(eventName);
  }

  private updateToken() {
    this.ioSocket['auth'] = { token: this.authService.getToken() };
  }
}
