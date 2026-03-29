import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html'
})
export class SignupComponent {
  name: string = '';

  constructor(private auth: AuthService, private router: Router) {}

  onSignup(): void {
    if (!this.name) return;

    this.auth.login({ name: this.name });
    this.router.navigate(['/dashboard']);
  }
}