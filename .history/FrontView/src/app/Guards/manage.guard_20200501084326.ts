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
    var user:Usuario = this.authService.getUserByToken();
    if (user.i === 'ADMIN') {
      console.log('ENTRA TRUE MANAGEMENT GUARD');
      return true;
    } else {
      this.router.navigate(['/homeuser']);
      return false;
    }
  }
}
