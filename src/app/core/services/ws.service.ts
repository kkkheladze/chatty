import { inject, Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root',
})
export class WsService {
  socket = inject(Socket);

  sendMessage(eventName: string, data: any) {
    this.socket.emit(eventName, data);
  }

  getSocket<T>(eventName: string) {
    return this.socket.fromEvent<T>(eventName);
  }
}
