import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {EmailService} from '../../Services/email.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  emailForm: FormGroup;

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
      name: [''],
      phone: [''],
      email: [''],
      message: [''],
    });
  }

  enviarMail() {
    this.emailService.sendEmail({
      from: this.emailForm.get('email').value,
      to: 'ninesselas.contact@gmail.com',
      name: this.emailForm.get('name').value,
      text: this.emailForm.get('message').value,
      phone: this.emailForm.get('phone').value,
    })
      .subscribe(
        res => {
          alert('Correo Enviado! Gracias por contactarnos, en breve nos comunicaremos contigo!');
          this.createEmailForm();
          },
        err => console.log(err),
        () => {
          alert('Correo Enviado! Gracias por contactarnos, en breve nos comunicaremos contigo!');
          this.createEmailForm();
        }
      );
  }




}
