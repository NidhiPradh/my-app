import { Component } from '@angular/core';
import { AuthService } from '../core/services/auth.service';
import { User } from '../core/models/user.model';



@Component({
  selector: 'app-dashboard',
   standalone: false,
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
  user: User | null = null;

  constructor(private auth: AuthService) {
    this.auth.user$.subscribe(u => this.user = u);
  }
}