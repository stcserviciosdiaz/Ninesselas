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
  actorForm: FormGroup;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { 
    this.createRegisterForm();
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

}
