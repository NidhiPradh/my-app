import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from '../../../core/services/auth.service';
import { NgIf } from "../../../../../node_modules/@angular/common/types/_common_module-chunk";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  standalone: false
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