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
    {id: 1, nombreIdioma: 'Inglés', nivelIdioma: '' , isChecked: false},
    {id: 2, nombreIdioma: 'Francés', nivelIdioma: '', isChecked: false },
    {id: 3, nombreIdioma: 'Alemán', nivelIdioma: '', isChecked: false },
    {id: 4, nombreIdioma: 'Italiano', nivelIdioma: '', isChecked: false },
    {id: 5, nombreIdioma: 'Catalán', nivelIdioma: '', isChecked: false },
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
      idiomasHablados: new FormArray([])
    });
  }

  registrarActor() {

    alert(JSON.stringify(this.actorForm.value));


    // this.authService.signup(newUserObject).subscribe(
    //   res => {
    //     localStorage.setItem('token', res.token);
    //     console.log('Cuenta de Actor/Modelo creada exitosamente');
    //     // this.subirFotoPerfil();
    //     this.router.navigate(['/homeuser']);
    //   },
    //   (err) => {
    //     console.log(JSON.stringify(err));
    //   });

  }

  subirFotoPerfil() {
    const fd = new FormData();
    fd.append('avatar', this.selectedFile, this.selectedFile.name);
    this.authService.uploadAvatar(fd).subscribe(res => {
      console.log(res);
    });
  }

  onCheckChange(event) {
    const formArray: FormArray = this.actorForm.get('idiomasHablados') as FormArray;
    /* Selected */
    if (event.target.checked) {
      // Add a new control in the arrayForm
      formArray.push(new FormControl(event.target.value));
    } else {
      // find the unselected element
      let i = 0;

      formArray.controls.forEach((ctrl: FormControl) => {
        if (ctrl.value === event.target.value) {
          // Remove the unselected element from the arrayForm
          formArray.removeAt(i);
          return;
        }

        i++;
      });
    }
  }

}
