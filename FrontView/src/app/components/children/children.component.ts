import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import { AuthService } from '../../Services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-children',
  templateUrl: './children.component.html',
  styleUrls: ['./children.component.css']
})
export class ChildrenComponent implements OnInit {
  childForm: FormGroup;

  avatarFile: File = null;
  familyBookFile: File = null;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.childForm = this.formBuilder.group({
      username: [''],
      nombres: [''],
      nombreArtistico: [''],
      apellidos: [''],
      email: [''],
      password: [''],
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
      numeroDNIPadre: [''],
      numeroDNIMadre: [''],
      numeroDNIRepresentante: [''],
      ultimosTrabajos: [''],
      avatar: [''],
      libroFamilia: [''],
    });
  }

  onAvatarSelected(event) {
    this.avatarFile = event.target.files[0] as File;
  }

  onFamilyBookSelected(event) {
    this.familyBookFile = event.target.files[0] as File;
  }

  signupChild() {
    const newChild = this.childForm.value;
    alert('Companía a registrar: ' + JSON.stringify(newChild))
    this.authService.signup(newChild).subscribe(
      res => {
        localStorage.setItem('token', res.token);
        console.log('Cuenta de Niño creada exitosamente');
        this.router.navigate(['/homeuser']);
      },
      (err) => {
        console.log(JSON.stringify(err));
      });
  }

}
