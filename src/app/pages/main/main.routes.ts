import { Routes } from '@angular/router';
import { MainComponent } from './main.component';
import { ChatComponent } from './chat/chat.component';

export default [
  {
    path: '',
    component: MainComponent,
    // children: [
    //   { path: '', component: ChatComponent },
    //   { path: ':id', component: ChatComponent },
    // ],
  },
] as Routes;
