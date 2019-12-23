import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Services/auth.service';
import { NgxSmartModalService } from 'ngx-smart-modal';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.css']
})
export class ForgotComponent implements OnInit {
  ResetForm: FormGroup;
  submitted = false;
  @ViewChild (TemplateRef, {static: false}) tpl: TemplateRef <any>;
  constructor(
    private authService: AuthService, 
    private FormBuilder: FormBuilder,
    public ngxSmartModalService: NgxSmartModalService,
    private router: Router,
  ) { 
    this.ResetRegisterForm();
  }

  ngOnInit() {
  }

  ResetRegisterForm(){
    this.ResetForm = this.FormBuilder.group({
      email: [null, [Validators.required, Validators.email]]
    })
  }

  sendPasswordResetRequest(){
    const email = this.ResetForm.controls['email'].value;
  }

}
