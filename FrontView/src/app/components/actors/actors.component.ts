import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-actors',
  templateUrl: './actors.component.html',
  styleUrls: ['./actors.component.css']
})
export class ActorsComponent implements OnInit, OnDestroy {
  actorForm: FormGroup;
  @Input() inputArray;
  subscriber;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
  ) {
    this.createRegisterForm();
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.subscriber.unsubscribe();
  }

  createRegisterForm() {
    this.actorForm = this.formBuilder.group({
      username: [''],
      primerNombre: [''],
      apellidos: [''],
      email: [''],
      password: [''],
      alias: [''],
      genero: [''],
      telefonoFijo: [''],
      fechaNacimiento: [''],
      pais: [''],
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
    });
  }

  registrarActor() {
    // recipe_name: this.recipeForm.get('recipeName').value,



    const newUserObject = {
      rol: 'CommonUser',
      username: this.actorForm.get('username').value,
      email: this.actorForm.get('email').value,
      password: this.actorForm.get('password').value,
      primerNombre: this.actorForm.get('primerNombre').value,
      apellidos: this.actorForm.get('apellidos').value,
      alias: this.actorForm.get('alias').value,
      genero: this.actorForm.get('genero').value,
      telefonoFijo: this.actorForm.get('telefonoFijo').value,
      fechaNacimiento: this.actorForm.get('fechaNacimiento').value,
      pais: this.actorForm.get('pais').value,
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
      numeroSeguridadSocial: this.actorForm.get('numeroSeguridadSocial').value,
      // bookPhotos: this.actorForm.get('bookPhotos').value,
      // curriculum: this.actorForm.get('curriculum').value,
    };
    alert(JSON.stringify(newUserObject))
    this.subscriber = this.authService.signup(newUserObject).subscribe(
      res => {
        alert(res); },
      (err) => {
        alert(err); },
      () => {
        alert('Successfully created a new user');
      });

  }

}
