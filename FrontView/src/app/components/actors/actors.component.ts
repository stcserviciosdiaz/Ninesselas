import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import { AuthService } from '../../Services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-actors',
  templateUrl: './actors.component.html',
  styleUrls: ['./actors.component.css']
})
export class ActorsComponent implements OnInit {
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
      username: [''],
      mayorEdad: [''],
      primerNombre: [''],
      nombreArtistico: [''],
      apellidos: [''],
      email: [''],
      password: [''],
      alias: [''],
      genero: [''],
      telefonoFijo: [''],
      fechaNacimiento: [''],
      pais: [''],
      tallaPantalon: [''],
      tallaCamisa: [''],
      tallaChaqueta: [''],
      pie: [''],
      altura: [''],
      colorPiel: [''],
      colorPelo: [''],
      colorOjos: [''],
      numeroDNI: [''],
      modeloCoche: [''],
      modeloMoto: [''],
      numeroSeguridadSocial: [''],
      razaMascota: [''],
      numeroDNIPadre: [''],
      numeroDNIMadre: [''],
      numeroDNIRepresentante: [''],
      ultimosTrabajos: [''],
      avatar: [''],
    });
  }

  registrarActor() {
    const newUserObject = this.actorForm.value
    this.subscriber = this.authService.signup(newUserObject).subscribe(
      res => {
        localStorage.setItem('token', res.token);
        console.log('Cuenta de Actor/Modelo creada exitosamente');
        // this.subirFotoPerfil();
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
