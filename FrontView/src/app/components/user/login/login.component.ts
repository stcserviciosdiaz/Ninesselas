import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {AuthService} from '../../../Services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

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
      password: [''],
      email: [''],
    });
  }

  loginUser() {
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
          } else {
            this.router.navigate(['/homeuser']);
          }
        },
        err => console.log(JSON.stringify(err))
      );
  }


}
