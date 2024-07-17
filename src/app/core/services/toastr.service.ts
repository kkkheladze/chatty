import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

export enum TOASTER_TYPE {
  SUCCESS = 'success',
  ERROR = 'error',
  INFO = 'info',
  WARNING = 'warn',
}

export type ToasterConfig = {
  type: TOASTER_TYPE;
  title?: string;
  description?: string;
};

@Injectable({
  providedIn: 'root',
})
export class ToasterService {
  private messageService = inject(MessageService);

  open({ type, title, description }: ToasterConfig) {
    this.messageService.add({
      severity: type,
      summary: title,
      detail: description,
    });
  }
}
