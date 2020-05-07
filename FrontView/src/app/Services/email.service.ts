import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  url;

  constructor(
    private http: HttpClient
  ) {
    //this.url = 'http://localhost:5000/';
    //this.url = 'http://64.202.188.102:8080/servicio-login-1.0/';
    this.url = 'https://servicio-ninesselas.herokuapp.com/';
  }

  /**EMAIL */
  notificarRegistro(email): Observable<any> {
    return this.http.post<any>(this.url + 'servicio-email/notificarRegistro', email);
  }

  notificarContacto(email): Observable<any> {
    return this.http.post<any>(this.url + 'servicio-email/notificarContacto', email);
  }
  /**FIN SERVICIO EMAIL */



}
