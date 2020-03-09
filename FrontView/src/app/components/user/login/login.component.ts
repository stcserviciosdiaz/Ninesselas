import { Usuario } from 'src/app/models/usuario';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { AuthService } from '../../../Services/auth.service';
import { Router } from '@angular/router';
import { ErrorStateMatcher } from '@angular/material';
import { SeoService } from 'src/app/Services/seo.service';
import { Title } from '@angular/platform-browser';


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

  constructor(
    private title: Title,
    private seo: SeoService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
  ) {
    this.createLoginForm();
  }

  ngOnInit() {
    let t:string = "Ninesselas - Login";
    this.title.setTitle(t);

    this.seo.generateTags({
      title: "Ninesselas - Login",
      description: "Nines Selas Agency",
      slug: "login"
    });
  }

  createLoginForm() {
    this.loginForm = this.formBuilder.group({
      password: [''],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  loginUser() {
    this.isSubmitted = true;
    //alert('SUCCESS!!');
    if (this.loginForm.invalid) {
      console.log(this.loginForm.get('email').value);

      console.log(this.loginForm.get('password').value);
      return;
    }
    const user = {
      email: this.loginForm.get('email').value,
      password: this.loginForm.get('password').value,
    };
    this.authService.login2(user.email, user.password)
      .subscribe(
        res => {
          let usuario: Usuario = res;

          localStorage.setItem('token', res.idUser);
          if (usuario.idType.nombres === 'COMPAÑIA') {
            this.router.navigate(['/company']);
          } else if (usuario.idType.nombres === 'ROOT' || usuario.idType.nombres === 'ADMIN') {
            this.router.navigate(['/management']);
          } else {
            this.router.navigate(['/homeuser']);
          }
        },
        err => console.log(JSON.stringify(err))
      );
  }


}
