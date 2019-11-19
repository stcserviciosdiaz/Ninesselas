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
export class RegisterComponent implements OnInit, OnDestroy {
  userForm: FormGroup;

  @Input() inputArray;
  subscriber;
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

  ngOnDestroy(): void {
    this.subscriber.unsubscribe();
  }

  createRegisterForm() {
    this.userForm = this.formBuilder.group({
      username: [''],
      password: [''],
      email: ['']
    });
  }

  registrarUsuario() {
    // recipe_name: this.recipeForm.get('recipeName').value,
    const newUserObject = {
      rol: 'Company',
      username: this.userForm.get('username').value,
      email: this.userForm.get('email').value,
      password: this.userForm.get('password').value,
      nombreArtistico: '',
      primerNombre: '',
      apellidos: '',
      alias: '',
      genero: 0,
      telefonoFijo: '',
      fechaNacimiento: '',
      pais: '',
      tallaPantalon: 0,
      tallaCamisa: 0,
      tallaChaqueta: 0,
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
    this.subscriber = this.authService.signup(newUserObject).subscribe(
       res => {
         alert(JSON.stringify(res)); },
      (err) => {
        alert(JSON.stringify(err)); },
      () => {
        alert('Tu cuenta ha sido creada exitosamente');
        // this.router.navigate(['home']);
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
