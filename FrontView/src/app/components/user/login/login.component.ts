import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {AuthService} from '../../../Services/auth.service';

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
  ) {
    this.createLoginForm();
  }



  ngOnInit() {
  }

  createLoginForm() {
    this.loginForm = this.formBuilder.group({
      username: [''],
      password: [''],
      email: [''],
      telefonoFijo: [''],
    });
  }




}
