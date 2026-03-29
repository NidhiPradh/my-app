import { Component } from '@angular/core';
import { AuthService, User } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {
  user: User | null = null;

  constructor(private auth: AuthService, private router: Router) {
    this.auth.user$.subscribe(u => this.user = u);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/signin']);
  }
}