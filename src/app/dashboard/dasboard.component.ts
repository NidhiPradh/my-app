import { Component } from '@angular/core';
import { AuthService, User } from '../core/services/auth.service';
import { NavbarComponent } from "../shared/components/navbar/navbar.component";


@Component({
  selector: 'app-dashboard',
   standalone: false,
  templateUrl: './dashboard.component.html',
  //imports: [NavbarComponent]
})
export class DashboardComponent {
  user: User | null = null;

  constructor(private auth: AuthService) {
    this.auth.user$.subscribe(u => this.user = u);
  }
}