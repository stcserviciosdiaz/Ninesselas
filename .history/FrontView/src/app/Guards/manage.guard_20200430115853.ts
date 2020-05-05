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
          if (res.idType.nombres === 'ADMIN') {
            console.log('ENTRAADMIN TRUE');
            return true;
          } else {
            console.log('ENTRAADMIN FALSE');
            return false;
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
