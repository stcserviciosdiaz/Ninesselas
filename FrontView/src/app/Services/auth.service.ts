import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  url;

  constructor(private http: HttpClient) {
    this.url = 'http://localhost:1337/user/';
  }

  signup(newUser): Observable<any> {
    return this.http.post<any>(this.url + 'signup', newUser);
  }

  login(user): Observable<any> {
    return this.http.post(this.url + 'login', user);
  }
}
