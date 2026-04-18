# Authorization, Auth Guard & Interceptor Skills

A comprehensive guide for implementing secure authorization, route protection, and HTTP request authentication in Angular applications.

## Table of Contents
1. [Authorization System Overview](#authorization-system-overview)
2. [Authentication Service](#authentication-service)
3. [Auth Guard](#auth-guard)
4. [HTTP Interceptor](#http-interceptor)
5. [Best Practices](#best-practices)
6. [Security Considerations](#security-considerations)
7. [Error Handling](#error-handling)
8. [Testing Strategies](#testing-strategies)
9. [Improvements & Enhancements](#improvements--enhancements)

---

## Authorization System Overview

Your application implements a token-based (JWT-like) authorization system with three key components:

| Component | Purpose | Location |
|-----------|---------|----------|
| **AuthService** | Manages user state, login, logout, token storage | `src/app/core/services/auth.service.ts` |
| **AuthGuard** | Protects routes from unauthorized access | `src/app/core/guards/auth.guard.ts` |
| **AuthInterceptor** | Automatically adds auth tokens to HTTP requests | `src/app/core/interceptors/auth.interceptor.ts` |

---

## Authentication Service

### Current Implementation
The `AuthService` manages:
- User login/logout workflows
- Token storage in localStorage
- User state via BehaviorSubject Observable
- Token persistence on app initialization

### Key Responsibilities
```typescript
// Login: POST credentials, store token & user
login(credentials: LoginRequest): Observable<LoginResponse>

// Logout: Clear tokens and user state
logout(): void

// Load persisted token on app init
loadToken(): void

// Check authentication status
isLoggedIn(): boolean

// Retrieve current token
getToken(): string | null
```

### Service Usage Pattern
```typescript
// In components
constructor(private auth: AuthService) {
  this.auth.user$.subscribe(u => this.user = u);
}

// Login
this.auth.login(credentials).subscribe(
  (response) => this.router.navigate(['/dashboard']),
  (error) => this.errorMessage = error.error?.message
);

// Logout
this.auth.logout();
this.router.navigate(['/signin']);
```

### Current Strengths
✅ Observable pattern for reactive state updates  
✅ Token persistence on app reload  
✅ Error handling in login flow  
✅ Centralized auth logic  

---

## Auth Guard

### Current Implementation
The `AuthGuard` protects routes by:
1. Checking if user has valid token (`isLoggedIn()`)
2. Allowing navigation if authenticated
3. Redirecting to signin if not authenticated

### Basic Pattern
```typescript
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.auth.isLoggedIn()) {
      return true;
    }
    this.router.navigate(['/signin']);
    return false;
  }
}
```

### Route Configuration Usage
```typescript
{
  path: 'dashboard',
  loadChildren: () => import('./dashboard/dashboard.module')
    .then(m => m.DashboardModule),
  canActivate: [AuthGuard]  // Protect route
},

{
  path: 'products',
  loadChildren: () => import('./products/product.module')
    .then(m => m.ProductModule)
  // Currently uncommented - not protected
}
```

### Current Issues & Improvements Needed
⚠️ **Synchronous Only**: Doesn't handle async token validation  
⚠️ **No Role-Based Protection**: Cannot guard by user roles  
⚠️ **Generic Name**: Consider `RoleGuard` for role-based variations  
⚠️ **No Logging**: Missing audit trail of guard decisions  

---

## HTTP Interceptor

### Current Implementation
The `AuthInterceptor` automatically:
1. Retrieves stored token via `AuthService.getToken()`
2. Clones outgoing HTTP requests
3. Adds `Authorization: Bearer {token}` header
4. Passes request to next handler

### Implementation Pattern
```typescript
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {}

  intercept(
    request: HttpRequest<unknown>, 
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const token = this.auth.getToken();
    
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    return next.handle(request);
  }
}
```

### Module Registration
```typescript
// AppModule
providers: [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
]
```

### How It Works
```
Component makes HTTP request
         ↓
AuthInterceptor intercepts
         ↓
Check if token exists
         ↓
Clone request + add Authorization header
         ↓
Pass to next handler (backend API)
         ↓
Backend validates token & responds
```

### Current Strengths
✅ Automatic token injection  
✅ Clean request cloning  
✅ Centralized auth header logic  
✅ Doesn't add header if no token  

---

## Best Practices

### 1. **Service Initialization Pattern**
```typescript
// In AuthService constructor - always load saved tokens
constructor(private http: HttpClient) {
  this.loadToken();  // Restore session on app refresh
}
```

### 2. **State Management Pattern**
```typescript
// Use BehaviorSubject for reactive state
private userSubject = new BehaviorSubject<User | null>(null);
user$ = this.userSubject.asObservable();

// Update in components via subscribe
this.auth.user$.subscribe(u => this.user = u);
```

### 3. **Error Handling in Login**
```typescript
this.auth.login(credentials).subscribe(
  (response) => {
    // Success: navigate
    this.router.navigate(['/dashboard']);
  },
  (error) => {
    // Failure: show error message
    this.errorMessage = error.error?.message || 'Login failed';
  }
);
```

### 4. **Token Persistence**
```typescript
// Store in localStorage with specific keys
private tokenKey = 'auth_token';
private userKey = 'auth_user';

// Wrap sensitive data
localStorage.setItem(this.userKey, JSON.stringify(user));

// Parse with error handling
try {
  const user = JSON.parse(userStr);
} catch (error) {
  console.error('Parse error:', error);
  this.logout();  // Clear if corrupted
}
```

### 5. **Lazy-Loaded Module Routing**
```typescript
// Combine lazy loading with guards
{
  path: 'dashboard',
  loadChildren: () => import('./dashboard/dashboard.module')
    .then(m => m.DashboardModule),
  canActivate: [AuthGuard]
}
```

---

## Security Considerations

### 🔒 Current Security Measures
✅ Bearer token in Authorization header  
✅ Token stored in localStorage  
✅ Guard redirects unauthorized access  
✅ Automatic token injection via interceptor  

### ⚠️ Potential Vulnerabilities

#### 1. **localStorage vs sessionStorage**
**Issue**: localStorage persists across browser closes. Token survives session.

**Mitigation Options**:
```typescript
// Option 1: Use sessionStorage for sensitive data
sessionStorage.setItem(this.tokenKey, response.token);

// Option 2: Hybrid approach - short-term JWT + refresh token
// Store refresh token in httpOnly cookie (secure from XSS)
// Store access token in memory (lost on refresh)

// Option 3: Implement token expiration
private tokenExpirationTime: number = 0;
if (response.expiresIn) {
  this.tokenExpirationTime = Date.now() + response.expiresIn * 1000;
}
```

#### 2. **XSS (Cross-Site Scripting) Risks**
**Issue**: localStorage tokens vulnerable to XSS attacks.

**Mitigation**:
```typescript
// Use httpOnly cookies (set by backend)
// Interceptor automatically includes cookies
// Frontend cannot access via JavaScript

// OR: Token in memory with refresh token rotation
private token: string | null = null;  // Memory storage
```

#### 3. **CSRF (Cross-Site Request Forgery)**
**Issue**: Attackers can make requests on behalf of users.

**Mitigation**:
```typescript
// Backend validates CSRF tokens
// Add CSRF token header for state-changing operations
const csrfToken = document.querySelector('meta[name="csrf-token"]')
  ?.getAttribute('content');

if (csrfToken && this.isStateChangingRequest(request)) {
  request = request.clone({
    setHeaders: { 'X-CSRF-Token': csrfToken }
  });
}
```

#### 4. **Token Expiration & Refresh**
**Issue**: Long-lived tokens increase damage if compromised.

**Mitigation**:
```typescript
// Check token expiration before navigation
canActivate(): boolean | Observable<boolean> {
  if (this.auth.isTokenExpired()) {
    this.auth.refreshToken().subscribe(
      () => true,
      () => {
        this.router.navigate(['/signin']);
        return false;
      }
    );
  }
  return this.auth.isLoggedIn();
}
```

---

## Error Handling

### Login Error Handling Pattern
```typescript
onLogin(): void {
  if (!this.username || !this.password) {
    this.errorMessage = 'Please enter username and password';
    return;
  }

  this.isLoading = true;
  this.errorMessage = '';

  this.auth.login(credentials).subscribe(
    (response) => {
      this.isLoading = false;
      this.router.navigate(['/dashboard']);
    },
    (error) => {
      this.isLoading = false;
      
      // Handle different error scenarios
      if (error.status === 401) {
        this.errorMessage = 'Invalid credentials';
      } else if (error.status === 0) {
        this.errorMessage = 'Cannot reach server';
      } else {
        this.errorMessage = error.error?.message || 'Login failed';
      }
      
      console.error('Login error:', error);
    }
  );
}
```

### Interceptor Error Handling
```typescript
intercept(
  request: HttpRequest<unknown>,
  next: HttpHandler
): Observable<HttpEvent<unknown>> {
  const token = this.auth.getToken();
  
  if (token) {
    request = request.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  return next.handle(request).pipe(
    catchError(error => {
      // Handle 401 Unauthorized
      if (error.status === 401) {
        this.auth.logout();
        this.router.navigate(['/signin']);
      }
      return throwError(() => error);
    })
  );
}
```

---

## Testing Strategies

### 1. **Testing AuthService**
```typescript
describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should store token on login', () => {
    const credentials = { username: 'test', password: 'pass' };
    const mockResponse = { token: 'jwt-token', user: {} };

    service.login(credentials).subscribe();

    const req = httpMock.expectOne('https://localhost:7286/api/Auth/login');
    req.flush(mockResponse);

    expect(localStorage.getItem('auth_token')).toBe('jwt-token');
  });

  it('should clear token on logout', () => {
    localStorage.setItem('auth_token', 'jwt-token');
    service.logout();
    expect(localStorage.getItem('auth_token')).toBeNull();
  });

  it('should return true when logged in', () => {
    localStorage.setItem('auth_token', 'jwt-token');
    expect(service.isLoggedIn()).toBe(true);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });
});
```

### 2. **Testing AuthGuard**
```typescript
describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: AuthService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: { isLoggedIn: jasmine.createSpy() } },
        { provide: Router, useValue: { navigate: jasmine.createSpy() } }
      ]
    });
    guard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  it('should allow access when logged in', () => {
    (authService.isLoggedIn as jasmine.Spy).and.returnValue(true);
    expect(guard.canActivate()).toBe(true);
  });

  it('should redirect to signin when not logged in', () => {
    (authService.isLoggedIn as jasmine.Spy).and.returnValue(false);
    expect(guard.canActivate()).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/signin']);
  });
});
```

### 3. **Testing AuthInterceptor**
```typescript
describe('AuthInterceptor', () => {
  let httpMock: HttpTestingController;
  let authService: AuthService;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthInterceptor,
        { provide: AuthService, useValue: { getToken: () => 'jwt-token' } },
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService);
    httpClient = TestBed.inject(HttpClient);
  });

  it('should add Authorization header', () => {
    httpClient.get('/api/data').subscribe();

    const req = httpMock.expectOne('/api/data');
    expect(req.request.headers.has('Authorization')).toBe(true);
    expect(req.request.headers.get('Authorization')).toBe('Bearer jwt-token');

    req.flush({});
  });

  afterEach(() => {
    httpMock.verify();
  });
});
```

---

## Improvements & Enhancements

### 1. **Add Role-Based Access Control (RBAC)**
```typescript
// Extend User model
export interface User {
  id?: string;
  username?: string;
  roles?: string[];  // ['admin', 'user']
  token?: string;
}

// Create RoleGuard
@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredRoles = route.data['roles'] as string[];
    
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const user = this.auth.getCurrentUser();
    const hasRole = user?.roles?.some(role => requiredRoles.includes(role));

    if (hasRole) {
      return true;
    }

    this.router.navigate(['/access-denied']);
    return false;
  }
}

// Usage in routing
{
  path: 'admin',
  loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
  canActivate: [AuthGuard, RoleGuard],
  data: { roles: ['admin'] }
}
```

### 2. **Add Token Refresh Logic**
```typescript
@Injectable({ providedIn: 'root' })
export class AuthService {
  private refreshToken$ = new Subject<void>();

  refreshToken(): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.apiUrl}/refresh`,
      { token: this.getToken() }
    ).pipe(
      tap(response => {
        localStorage.setItem(this.tokenKey, response.token);
        this.refreshToken$.next();
      })
    );
  }
}

// In interceptor - handle 401 with retry
intercept(request: HttpRequest<unknown>, next: HttpHandler) {
  return next.handle(request).pipe(
    catchError(error => {
      if (error.status === 401) {
        return this.auth.refreshToken().pipe(
          switchMap(() => {
            const newRequest = request.clone({
              setHeaders: {
                Authorization: `Bearer ${this.auth.getToken()}`
              }
            });
            return next.handle(newRequest);
          }),
          catchError(() => {
            this.auth.logout();
            this.router.navigate(['/signin']);
            return throwError(() => error);
          })
        );
      }
      return throwError(() => error);
    })
  );
}
```

### 3. **Add Token Expiration Check**
```typescript
export class AuthService {
  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      const decoded = this.decodeToken(token);
      const expirationDate = new Date(decoded.exp * 1000);
      const now = new Date();
      const timeUntilExpiration = expirationDate.getTime() - now.getTime();
      
      // Refresh if less than 5 minutes left
      return timeUntilExpiration < 5 * 60 * 1000;
    } catch {
      return true;
    }
  }

  private decodeToken(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return null;
    }
  }
}
```

### 4. **Add Request/Response Logging**
```typescript
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private auth: AuthService,
    private logger: LoggerService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler) {
    const token = this.auth.getToken();
    
    if (token) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
      this.logger.debug('Auth header added to request', { url: request.url });
    }

    return next.handle(request).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          this.logger.debug('Response received', { 
            url: event.url, 
            status: event.status 
          });
        }
      }),
      catchError(error => {
        this.logger.error('Request failed', { 
          url: request.url, 
          status: error.status,
          message: error.message
        });
        return throwError(() => error);
      })
    );
  }
}
```

### 5. **Add Logout on 401 Response**
```typescript
// Already implemented pattern in interceptor
intercept(request: HttpRequest<unknown>, next: HttpHandler) {
  return next.handle(request).pipe(
    catchError(error => {
      if (error.status === 401) {
        // Token invalid/expired - clear and redirect
        this.auth.logout();
        this.router.navigate(['/signin']);
      }
      return throwError(() => error);
    })
  );
}
```

### 6. **Add Guard Performance Metrics**
```typescript
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router,
    private analytics: AnalyticsService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const start = performance.now();
    const isLoggedIn = this.auth.isLoggedIn();
    const duration = performance.now() - start;

    this.analytics.trackGuardCheck({
      route: route.routeConfig?.path,
      result: isLoggedIn ? 'allowed' : 'denied',
      duration
    });

    if (isLoggedIn) {
      return true;
    }

    this.router.navigate(['/signin']);
    return false;
  }
}
```

---

## Quick Reference Checklist

### When Implementing Auth:
- [ ] Create AuthService with login/logout/token methods
- [ ] Create AuthGuard to protect routes
- [ ] Create AuthInterceptor to auto-add token headers
- [ ] Register interceptor in AppModule providers
- [ ] Apply AuthGuard to protected routes
- [ ] Handle 401 errors in login component
- [ ] Implement logout in navbar component
- [ ] Test all auth flows (login, logout, guard)
- [ ] Secure token storage (localStorage vs sessionStorage)
- [ ] Add error handling for network failures
- [ ] Consider token refresh on expiration
- [ ] Implement role-based guards if needed

### Security Checklist:
- [ ] HTTPS enabled on all auth endpoints
- [ ] Tokens never logged in console
- [ ] Sensitive operations require re-authentication
- [ ] Token expiration enforced
- [ ] Refresh token rotation implemented
- [ ] CSRF protection enabled
- [ ] XSS prevention measures in place
- [ ] Interceptor handles 401 responses
- [ ] Logout clears all auth data
- [ ] sessionStorage preferred over localStorage

---

## Resources & References

- [Angular Security Guide](https://angular.io/guide/security)
- [Router Guards](https://angular.io/guide/router#preventing-unauthorized-access)
- [HTTP Interceptors](https://angular.io/guide/http#intercepting-requests-and-responses)
- [JWT Understanding](https://jwt.io/introduction)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)

---

**Last Updated**: April 18, 2026  
**Version**: 1.0  
**Maintained By**: Development Team
