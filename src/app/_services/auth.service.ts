import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { LocalStorageService } from './local-storage.service';
import { User } from '../_interfaces/user.interface';
import { environment } from 'src/environments/environment';

interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$ = new BehaviorSubject(null);

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService
  ) {}

  login(form: { email: string; password: string }): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${environment.apiUrl}/api/token/`, form)
      .pipe(
        tap((response) => {
          this.user$.next(response.user);
          this.setToken('access', response.access);
          this.setToken('refresh', response.refresh);
        })
      );
  }

  logout(): void {
    this.localStorageService.removeItem('access');
    this.localStorageService.removeItem('refresh');
    this.user$.next(null);
  }

  getCurrentUser(): Observable<User> {
    return this.user$.pipe(
      switchMap((user) => {
        if (user) {
          return of(user);
        }
        const token = this.localStorageService.getItem('access');
        if (token) {
          return this.fetchCurrentUser();
        }
        return of(null);
      })
    );
  }

  fetchCurrentUser(): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/users/1`).pipe(
      tap((user) => {
        this.user$.next(user);
      })
    );
  }

  refreshToken(): Observable<{ access: string; refresh: string }> {
    const refresh = this.localStorageService.getItem('refresh');

    return this.http
      .post<{ access: string; refresh: string }>(
        `${environment.apiUrl}/api/token/refresh/`,
        {
          refresh,
        }
      )
      .pipe(
        tap((response) => {
          this.setToken('access', response.access);
          this.setToken('refresh', response.refresh);
        })
      );
  }

  private setToken(key: string, token: string): void {
    this.localStorageService.setItem(key, token);
  }
}
