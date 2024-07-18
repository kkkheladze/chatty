import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';

import { toSignal } from '@angular/core/rxjs-interop';
import { CheckboxModule } from 'primeng/checkbox';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { filter } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { TOASTER_TYPE, ToasterService } from '../../core/services/toastr.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, ButtonModule, PasswordModule, InputTextModule, FloatLabelModule, IconFieldModule, InputIconModule, CheckboxModule],
  templateUrl: './register.component.html',
  styleUrl: '/src/app/core/styles/auth-pages.scss',
})
export default class RegisterComponent {
  private authService = inject(AuthService);
  private fb = inject(NonNullableFormBuilder);
  private router = inject(Router);
  private toasterService = inject(ToasterService);

  loading = signal<boolean>(false);
  registerForm = this.fb.group({
    name: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.pattern('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$')]],
  });
  invalid = toSignal(this.registerForm.statusChanges.pipe(filter((status) => status === 'INVALID')));

  register() {
    this.registerForm.controls;
    this.loading.set(true);
    this.authService.register(this.registerForm.getRawValue()).subscribe({
      next: () => this.router.navigate(['/']),
      error: (error: HttpErrorResponse) => {
        for (const control in this.registerForm.controls) {
          this.registerForm.get(control)!.markAsDirty();
        }
        this.toasterService.open({
          type: TOASTER_TYPE.ERROR,
          title: 'Failed to register',
          description: error.statusText,
        });
        this.loading.set(false);
      },
    });
  }
}
