import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { getErrorMessage } from '../shared/helper-functions';
import { User } from './user.model';

export interface AuthResponse {
  idToken: string;
  refreshToken: string;
  expiresIn: string;
  email: string;
  localId: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}
  private tokenExpirationTimer: any = null;

  user = new BehaviorSubject<User | null>(null);

  handleAuthentication(
    email: string,
    idToken: string,
    localId: string,
    expiresIn: number
  ) {
    const expired = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, localId, idToken, expired);
    this.user.next(user);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  signup(email: string, password: string) {
    return this.http
      .post<AuthResponse>(
        'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyCTxz91I54ZHV8bv47LQ5m4CvKmCSd5DxI',
        {
          email,
          password,
          returnSecureToken: true,
          token:
            'AAAAAKUyVnk:APA91bFJd31-RNpYw42dufqZLaOHTwGnNhfe-ckdC6PJqiUl1fFGYjQynxYUVzcrKLH71GyZxZleCx9gEcY2iUDfoqMvcvchbJ0GjaLjo2yfb6loR09TBuzFwnOKCUQ0E3GrzbAJwzR0',
        }
      )
      .pipe(
        catchError((errorResponse) =>
          throwError(getErrorMessage(errorResponse))
        ),
        tap(({ email, idToken, localId, expiresIn }) => {
          this.handleAuthentication(email, idToken, localId, +expiresIn);
        })
      );
  }

  autoLogout(expirationDuration: number) {
    console.log('autoLogout', expirationDuration);
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    } else {
      this.tokenExpirationTimer = null;
    }
  }

  autoLogin() {
    if (!localStorage.getItem('userData')) return;
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: Date;
    } = JSON.parse(localStorage.getItem('userData') || '');

    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    if (loadedUser.Token) {
      this.user.next(loadedUser);
      const expirationDuration =
        new Date(userData._tokenExpirationDate).getTime() -
        new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponse>(
        'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyCTxz91I54ZHV8bv47LQ5m4CvKmCSd5DxI',
        {
          email,
          password,
          returnSecureToken: true,
          token:
            'AAAAAKUyVnk:APA91bFJd31-RNpYw42dufqZLaOHTwGnNhfe-ckdC6PJqiUl1fFGYjQynxYUVzcrKLH71GyZxZleCx9gEcY2iUDfoqMvcvchbJ0GjaLjo2yfb6loR09TBuzFwnOKCUQ0E3GrzbAJwzR0',
        }
      )
      .pipe(
        catchError((errorResponse) =>
          throwError(getErrorMessage(errorResponse))
        ),
        tap(({ email, idToken, localId, expiresIn }) => {
          this.handleAuthentication(email, idToken, localId, +expiresIn);
        })
      );
  }
}
