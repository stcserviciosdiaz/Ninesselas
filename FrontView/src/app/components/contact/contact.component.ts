import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { EmailService } from '../../Services/email.service';
import { ErrorStateMatcher } from '@angular/material';
import { Email } from 'src/app/models/email';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  emailForm: FormGroup;
  submitted = false;
  matcher = new MyErrorStateMatcher();

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private emailService: EmailService
  ) {
    this.createEmailForm();
  }

  ngOnInit() {
  }

  createEmailForm() {
    this.emailForm = this.formBuilder.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: [''],
    });
  }

  enviarMail() {
    this.submitted = true;
    if (this.emailForm.invalid) {
      return;
    }
    const email: Email = {
      usernameTo: this.emailForm.get('name').value,
      emailTo: this.emailForm.get('email').value,
      telefonoTo: this.emailForm.get('phone').value,
      mensajeTo: this.emailForm.get('message').value
    };
    this.emailService.notificarContacto(email)
      .subscribe(
        res => {
          alert('Correo Enviado! Gracias por contactarnos, en breve nos comunicaremos contigo!');
          this.createEmailForm();
          this.router.navigate(['/home']);
        },
        err => console.log(err),
        () => {
          alert('Correo Enviado! Gracias por contactarnos, en breve nos comunicaremos contigo!');
          this.createEmailForm();
        }
      );
  }




}
