import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  url;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.url = 'http://localhost:1337/user/';
  }

  signup(newUser): Observable<any> {
    return this.http.post<any>(this.url + 'signup', newUser);
  }

  login(user): Observable<any> {
    return this.http.post(this.url + 'login', user);
  }

  uploadAvatar(avatar): Observable<any> {
    return this.http.post(this.url + 'uploadAvatar', avatar);
  }

  getAvatar(): Observable<any> {
    return this.http.get(this.url + 'avatar');
  }

  loggedIn() {
    return !!localStorage.getItem('token');
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getUser(): Observable<any> {
    return this.http.get(this.url);
  }

  logoutUser() {
    localStorage.removeItem('token');
    this.router.navigate(['/home']);
  }

}
