import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: false
})
export class NavbarComponent {
  user: User | null = null;
  showUserMenu = false;

  constructor(private auth: AuthService, private router: Router) {
    this.auth.user$.subscribe(u => this.user = u);
  }

  navigateToProducts(): void {
    this.router.navigate(['/products']);
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/signin']);
  }
}