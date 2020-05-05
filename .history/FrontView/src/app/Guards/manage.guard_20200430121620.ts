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
    this.authService.findByToken()
      .subscribe(res => {
        console.log('VALORES: '+res.idType.nombres);
        if (res.idType.nombres === 'ADMIN') {
          match = true;
        } else {
          match = false;
        }
      }, (err) => {
        match = false;
      });

      console.log('VALORES: '+this.authService.loggedIn());
      console.log('VALORES: '+this.authService.getToken());

      console.log('VALORES: '+match);
    if (this.authService.loggedIn() && match) {
      console.log('ENTRA TRUE MANAGEMENT GUARD');
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
