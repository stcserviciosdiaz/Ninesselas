import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  url;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    //this.url = 'http://localhost:5000/servicio-login/';
    this.url = 'https://servicio-login.herokuapp.com/servicio-login/';

  }

  signup2(newUser): Observable<any> {
    return this.http.post<any>(this.url + 'crear', newUser);
  }

  login2(usuario, password): Observable<any> {
    return this.http.get(this.url + 'login/' + usuario + "/" + password);
  }
  findByToken(): Observable<any> {
    console.info("TOKEN GUARDADO:  "+this.getToken());
    return this.http.get(this.url + 'ver/' + this.getToken());
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

  obtenerUsuario():string {
    return localStorage.getItem('token');
  }

  getUser(): Observable<any> {
    return this.http.get(this.url);
  }

  logoutUser() {
    localStorage.removeItem('token'); 0
    this.router.navigate(['/home']);
  }

  getAllUsers(): Observable<any> {
    return this.http.get(this.url + 'listar');
  }

  getAllCompanies(): Observable<any> {
    return this.http.get(this.url + 'listar');
  }

  deleteUser(id): Observable<any> {
    return this.http.delete(this.url + id);
  }

}
