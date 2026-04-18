import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from '../models/user.model';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user?: User;
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7286/api/Auth';
  private tokenKey = 'auth_token';
  private userKey = 'auth_user';
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadToken();
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          localStorage.setItem(this.tokenKey, response.token);
          // 🔥 Decode JWT
        const decodedToken = this.decodeToken(response.token);

        // 🔥 Build user object from token
        const user: User = {
          id: decodedToken?.UserId || '', // Assuming token has 'id' claim
          username: decodedToken?.sub || credentials.username, // 'sub' = subject (common in JWT)
          roles: decodedToken?.role || decodedToken?.roles || [],
          email: decodedToken?.email || '',
          token: response.token
        };

        // Save
        localStorage.setItem(this.userKey, JSON.stringify(user));
        this.userSubject.next(user);

        console.log('Decoded Token:', decodedToken);
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.userSubject.next(null);
  }

  loadToken(): void {
    const token = localStorage.getItem(this.tokenKey);
    const userStr = localStorage.getItem(this.userKey);
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        this.userSubject.next(user);
      } catch (error) {
        console.error('Error parsing user from storage:', error);
        this.logout();
      }
    }
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
  private decodeToken(token: string): any {
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload); // base64 decode
    return JSON.parse(decoded);
  } catch (e) {
    console.error('Invalid token');
    return null;
  }
}
}