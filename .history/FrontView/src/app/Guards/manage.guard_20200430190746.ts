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

  private perfil: string = '';

  canActivate(): boolean {
    this.authService.findByToken()
      .subscribe(res => {
        this.perfil = res.idType.nombres;
      }, (err) => { });

    if (this.perfil === 'ADMIN') {
      console.log('ENTRA TRUE MANAGEMENT GUARD');
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
