import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import { AuthService } from '../../Services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-figuracion',
  templateUrl: './figuracion.component.html',
  styleUrls: ['./figuracion.component.css']
})
export class FiguracionComponent implements OnInit {

  actorForm: FormGroup;
  selectedFile: File = null;
  @Input() inputArray;
  subscriber;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.createRegisterForm();
  }

  onFileSelected(event) {
    this.selectedFile = event.target.files[0] as File;
  }


  ngOnInit() {
  }

  createRegisterForm() {
    this.actorForm = this.formBuilder.group({
      email: [''],
      password: [''],
      username: [''],
      nombres: [''],
      apellidos: [''],
      sexo: [''],
      telefono: [''],
      fechaNacimiento: [''],
      nacionalidad: [''],
      acento: [''],
      tallaPantalon: [''],
      tallaCamisa: [''],
      tallaChaqueta: [''],
      pie: [''],
      altura: [''],
      colorPiel: [''],
      colorPelo: [''],
      colorOjos: [''],
      numeroDNI: [''],
      numeroSeguridadSocial: [''],
      carnetConducir: [''],
      modeloCoche: [''],
      colorCoche: [''],
      fotoCoche: [''],
      modeloMoto: [''],
      colorMoto: [''],
      fotoMoto: [''],
      avatar: [''],
      ultimosTrabajos: [''],
      tattoos: [''],
      manos: [''],
    });
  }

  registrarActor() {
    const newUserObject = {
      rol: 'CommonUser',
      username: this.actorForm.get('username').value,
      email: this.actorForm.get('email').value,
      password: this.actorForm.get('password').value,
      nombres: this.actorForm.get('nombres').value,
      apellidos: this.actorForm.get('apellidos').value,
      sexo: this.actorForm.get('sexo').value,
      acento: this.actorForm.get('acento').value,
      telefono: this.actorForm.get('telefono').value,
      fechaNacimiento: this.actorForm.get('fechaNacimiento').value,
      nacionalidad: this.actorForm.get('nacionalidad').value,
      tallaPantalon: this.actorForm.get('tallaPantalon').value,
      tallaCamisa: this.actorForm.get('tallaCamisa').value,
      tallaChaqueta: this.actorForm.get('tallaChaqueta').value,
      pie: this.actorForm.get('pie').value,
      altura: this.actorForm.get('altura').value,
      colorPiel: this.actorForm.get('colorPiel').value,
      colorPelo: this.actorForm.get('colorPelo').value,
      colorOjos: this.actorForm.get('colorOjos').value,
      numeroDNI: this.actorForm.get('numeroDNI').value,
      modeloCoche: this.actorForm.get('modeloCoche').value,
      modeloMoto: this.actorForm.get('modeloMoto').value,
      carnetConducir: this.actorForm.get('carnetConducir').value,
      colorCoche: this.actorForm.get('colorCoche').value,
      colorMoto: this.actorForm.get('colorMoto').value,
      numeroSeguridadSocial: this.actorForm.get('numeroSeguridadSocial').value,
      ultimosTrabajos: this.actorForm.get('ultimosTrabajos').value,
    };
    this.subscriber = this.authService.signup(newUserObject).subscribe(
      res => {
        localStorage.setItem('token', res.token);
        alert('Cuenta de Figuración creada exitosamente');
        // this.subirFotoPerfil()
        this.router.navigate(['/homeuser']);
      },
      (err) => {
        console.log(JSON.stringify(err));
      });

  }

  subirFotoPerfil() {
    const fd = new FormData();
    fd.append('avatar', this.selectedFile, this.selectedFile.name);
    this.authService.uploadAvatar(fd).subscribe(res => {
      console.log(res);
    });
  }


}
