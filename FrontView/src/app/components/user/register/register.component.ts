import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {AuthService} from '../../../Services/auth.service';
import {Router} from '@angular/router';
import { EmailService } from '../../../Services/email.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  userForm: FormGroup;

  @Input() inputArray;
  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private emailService: EmailService
    ) {
    this.createRegisterForm();
  }

  ngOnInit() {
  }

  createRegisterForm() {
    this.userForm = this.formBuilder.group({
      username: [''],
      password: [''],
      email: [''],
      telefonoFijo: [''],
    });
  }

  registrarUsuario() {
    const newUserObject = {
      rol: 'Company',
      username: this.userForm.get('username').value,
      email: this.userForm.get('email').value,
      password: this.userForm.get('password').value,
      telefonoFijo: this.userForm.get('telefonoFijo').value,
      mayorEdad: 1,
      nombreArtistico: '',
      primerNombre: '',
      apellidos: '',
      alias: '',
      genero: 0,
      fechaNacimiento: '',
      pais: '',
      tallaPantalon: 0,
      tallaCamisa: 0,
      tallaChaqueta: 888,
      pie: 0,
      altura: 0,
      colorPiel: '',
      colorPelo: '',
      colorOjos: '',
      numeroDNI: '',
      numeroSeguridadSocial: '',
      modeloCoche: '',
      modeloMoto: '',
      razaMascota: '',
      numeroDNIMadre: '',
      numeroDNIPadre: '',
      ultimosTrabajos: '',
    };
    this.authService.signup(newUserObject)
      .subscribe(
       res => {
         localStorage.setItem('token', res.token);
         this.router.navigate(['/company']);
         },
      (err) => {
        console.log(JSON.stringify(err));
       });
    // Uncomment this to send emails
    // this.emailService.sendEmail({
    //   from: '[Mailgun Sandbox <postmaster@sandbox6d7a81b77504424c9dd9928da3d501e1.mailgun.org>]',
    //   to: '[correo personal]',
    //   name: 'hola',
    //   text: 'Funciona',
    // })
    //   .subscribe(
    //     () => {},
    //     err => console.log(err)
    //   );
  }


}
