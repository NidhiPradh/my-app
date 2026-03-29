import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html'
})
export class SigninComponent {
  name: string = '';

  constructor(private auth: AuthService, private router: Router) {}

  onLogin(): void {
    if (!this.name) return;

    this.auth.login({ name: this.name });
    this.router.navigate(['/dashboard']);
  }
}