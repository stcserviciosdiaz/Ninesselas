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
    this.url = 'http://localhost:5000/';
    //this.url = 'https://servicio-login.herokuapp.com/';
  }

  /**EMAIL */
  enviarEmail(email): Observable<any> {
    return this.http.post<any>(this.url + 'servicio-email/enviar', email);
  }
  /**FIN SERVICIO EMAIL */



}
