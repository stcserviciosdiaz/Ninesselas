import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl, FormGroupDirective, NgForm} from '@angular/forms';
import {AuthService} from '../../../Services/auth.service';
import {Router} from '@angular/router';
import { ErrorStateMatcher } from '@angular/material';


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
  isSubmitted  =  false;

  matcher = new MyErrorStateMatcher();

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
  ) {
    this.createLoginForm();
  }


  ngOnInit() {
  }

  createLoginForm() {
    this.loginForm = this.formBuilder.group({
      password: ['',Validators.required],
      email: ['',[Validators.required, Validators.email]],
    });
  }

  loginUser() {
    this.isSubmitted = true;
    //alert('SUCCESS!!');
    if(this.loginForm.invalid){
      return;
    }
    const user = {
      email: this.loginForm.get('email').value,
      password: this.loginForm.get('password').value,
    };
    this.authService.login(user)
      .subscribe(
        res => {
          localStorage.setItem('token', res.token);
          if (res.rol === 'Manager') {
            this.router.navigate(['/management']);
          } else if (res.rol === 'Company') {
            this.router.navigate(['/company']);
          } else if (res.rol === 'Root' || res.rol === 'Admin') {
            this.router.navigate(['/management']);
          } else {
            this.router.navigate(['/homeuser']);
          }
        },
        err => console.log(JSON.stringify(err))
      );
  }


}
