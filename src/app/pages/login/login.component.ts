import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { AuthService } from '../../core/services/auth.service';
import { TOASTER_TYPE, ToasterService } from '../../core/services/toastr.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CardModule, ButtonModule, PasswordModule, InputTextModule, FloatLabelModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export default class LoginComponent {
  private fb = inject(NonNullableFormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toasterService = inject(ToasterService);

  loginForm = this.fb.group({
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.required]],
  });
  loading = signal<boolean>(false);

  login() {
    this.loading.set(true);
    this.authService.login(this.loginForm.getRawValue()).subscribe({
      next: () => this.router.navigate(['/']),
      error: (error: HttpErrorResponse) => {
        for (const control in this.loginForm.controls) {
          this.loginForm.get(control)!.markAsDirty();
        }
        this.toasterService.open({
          type: TOASTER_TYPE.ERROR,
          title: 'Failed to log in',
          description: error.statusText,
        });
        this.loading.set(false);
      },
    });
  }
}
