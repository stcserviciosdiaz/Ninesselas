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
      console.log('ENTRA TRUE MANAGEMENT GUARD');
      this.authService.findByToken()
        .subscribe(res => {
          if (res.idType.nombres === 'ADMIN') {
            match = true;
            return true;
          } else {
            match = false;
            return false;
          }
        }, (err) => {
          match = false;
        });

    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
