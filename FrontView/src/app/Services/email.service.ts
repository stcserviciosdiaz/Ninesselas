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
    this.url = 'http://localhost:1337/email';
  }

  sendEmail(data): Observable<any> {
    return this.http.post(this.url, data).pipe(map((res: any) => {
      return res;
    }));
  }
  private _errorHandler(error: HttpErrorResponse) {
    console.error(error);
    return Observable.throw(error || 'Server Error');
  }

//   return this.http.post(`${environment.apiPrefix}/auth/login`, credential).pipe(map((res: any) => {
// console.log('res', res);
// return res;
// }));

}
