import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';


@Component({
  selector: 'app-signup',
   standalone: false,
  templateUrl: './signup.component.html'
})
export class SignupComponent {
  name: string = '';

  constructor(private auth: AuthService, private router: Router) {}

  onSignup(): void {
    if (!this.name) return;

    this.auth.login({
      username: this.name,
      password: ''
    });
    this.router.navigate(['/dashboard']);
  }
}