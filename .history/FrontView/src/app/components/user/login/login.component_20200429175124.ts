import { Usuario } from 'src/app/models/usuario';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { AuthService } from '../../../Services/auth.service';
import { Router } from '@angular/router';
import { ErrorStateMatcher } from '@angular/material';
import { SeoService } from 'src/app/Services/seo.service';
import { Title } from '@angular/platform-browser';
import { NgxSmartModalService } from 'ngx-smart-modal';


export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isSubmitted = false;
  matcher = new MyErrorStateMatcher();

  constructor(public ngxSmartModalService: NgxSmartModalService,
    private title: Title,
    private seo: SeoService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
  ) {
    this.createLoginForm();
  }

  ngOnInit() {
    let t: string = "Ninesselas - Login";
    this.title.setTitle(t);

    this.seo.generateTags({
      title: "Ninesselas - Login",
      description: "Nines Selas Agency",
      slug: "login"
    });
  }

  createLoginForm() {
    this.loginForm = this.formBuilder.group({
      password: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      perfil: ['', Validators.required],
    });
  }

  loginUser() {
    this.isSubmitted = true;
    //alert('SUCCESS!!');
    if (this.loginForm.invalid) {
      return;
    }
    const user = {
      email: this.loginForm.get('email').value,
      password: this.loginForm.get('password').value,
      perfil: this.loginForm.get('perfil').value,
    };
    this.authService.login2(user.email, user.password, user.perfil)
      .subscribe(
        res => {
          let usuario: Usuario = res;

          if (res.idUser !== null) {
            localStorage.setItem('token', res.idUser);
            if (usuario.idType.nombres === 'COMPAÑIA') {
              this.router.navigate(['/company']);
            } else if (usuario.idType.nombres === 'ROOT' || usuario.idType.nombres === 'ADMIN') {
              this.router.navigate(['/management']);
            } else {
              this.router.navigate(['/homeuser']);
            }
          } else { this.ngxSmartModalService.create('error',
          'Usuario o Clave Incorrectas').open(); }
        },
        err => {
          this.ngxSmartModalService.create('error',
            'Usuario o Clave Incorrectas, imposible logearse').open();
          console.log(JSON.stringify(err))
        }
      );
  }


}
