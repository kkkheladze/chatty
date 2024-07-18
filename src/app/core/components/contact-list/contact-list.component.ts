import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [ReactiveFormsModule, IconFieldModule, InputIconModule, InputTextModule],
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.scss',
  host: { class: 'p-panel' },
})
export class ContactListComponent {
  searchInput = new FormControl('');
}
