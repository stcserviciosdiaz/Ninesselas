import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';
import { Usuario } from '../models/usuario';
import { find } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ManageGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {

  }

  canActivate(): boolean {
    let match: boolean = false;
    if (this.authService.loggedIn()) {
      this.authService.findByToken()
        .subscribe(res => {
          let user: Usuario = res;
          console.log('manage auth: ' + user.idType.nombres);
          if (user.idType.nombres === 'ADMIN') {
            return true;
          }
        }, (err) => {
          return false;
        });
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
