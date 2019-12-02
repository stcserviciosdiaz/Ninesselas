import {Component, NgModule, Input, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import { AuthService } from '../../Services/auth.service';
import {Router} from '@angular/router';
import {BrowserModule} from '@angular/platform-browser';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

@Component({
  selector: 'app-actors',
  templateUrl: './actors.component.html',
  styleUrls: ['./actors.component.css']
})
export class ActorsComponent implements OnInit {
  actorForm: FormGroup;
  selectedFile: File = null;
  disa = false;
  idiomasHablados = [
    {id: 0, nombreIdioma: 'Inglés', nivelIdioma: 'Nivel Medio' , isChecked: false},
    {id: 1, nombreIdioma: 'Francés', nivelIdioma: 'Nivel Medio', isChecked: false },
    {id: 2, nombreIdioma: 'Alemán', nivelIdioma: 'Nivel Medio', isChecked: false },
    {id: 3, nombreIdioma: 'Italiano', nivelIdioma: 'Nivel Medio', isChecked: false },
    {id: 4, nombreIdioma: 'Catalán', nivelIdioma: 'Nivel Medio', isChecked: false },
  ];

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
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
      modeloMoto: [''],
      colorMoto: [''],
      ultimosTrabajos: [''],
    });
  }

  registrarActor() {
    const newIdioma = [];
    for (const item of this.idiomasHablados) {
      if (item.isChecked === true) {
        newIdioma.push({nombreIdioma: item.nombreIdioma, nivelIdioma: item.nivelIdioma});
      }
    }
    const newUserObject = this.actorForm.value;
    newUserObject.idiomasHablados = newIdioma;
    alert(JSON.stringify(newUserObject))
    this.authService.signup(newUserObject).subscribe(
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

  onCheckLanguage(event) {
    if (event.target.checked) {
      for (const idioma of this.idiomasHablados) {
        if (idioma.nombreIdioma === event.target.value) {
          idioma.isChecked = true;
        }
      }
    } else {
      // find the unselected element
      for (const idioma of this.idiomasHablados) {
        if (idioma.nombreIdioma === event.target.value) {
          idioma.isChecked = false;
        }
      }
    }
  }

  onCheckLanguageLevel(event, i) {
    this.idiomasHablados[i].nivelIdioma = event.target.value;
  }

}
