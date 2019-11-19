import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(private http: HttpClient) { }

  sendEmail(data) {
    return this.http.post('http://localhost:1337/email/', data).pipe(map((res: any) => {
      console.log('res', res);
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
