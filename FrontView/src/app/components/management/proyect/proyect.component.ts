import { Component, OnInit, ViewChild, HostListener, Input } from '@angular/core';
import { AuthService } from 'src/app/Services/auth.service';
import { MdbTableDirective } from 'angular-bootstrap-md';
import { Usuario } from 'src/app/models/usuario';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-proyect',
  templateUrl: './proyect.component.html',
  styleUrls: ['./proyect.component.css']
})
export class ProyectComponent implements OnInit {

  Oncreated = false;

  @ViewChild(MdbTableDirective, { static: true }) 
  mdbTableUsers: MdbTableDirective;
  userInfo: Usuario = new Usuario();
  allUsers: Usuario[] = [];
  editField: string;
  numberOfUsers: number;
  idUserToUpdatePass: number;
  passtoUpdate: string;
  searchText = '';
  previousUser: string;
  mayorEdad: string;
  validatingForm: FormGroup;
  headElementsUsers = [
    'ID',
    'Nombres Completos',
    'Mayor de Edad',
    'Nombre Artístico',
    'Género',
    'Fecha de Nacimiento',
    'País',
    'Talla de Pantalón',
    'Talla de Camisa',
    'Talla de Chaqueta',
    'Pie',
    'Altura',
    'Color de Piel',
    'Color de Pelo',
    'Color de Ojos',
    'Modelo de Coche',
    'Modelo de Moto',
    'Número DNI',
    'Número de Seguridad Social',
    'Correo de Contacto',
    'Contraseña',
    'Teléfono de Contacto',
    'Eliminar',
  ];

  constructor(public authService: AuthService,
  ) { }

  ngOnInit() {
  }

  /***Crear Proyect */
  setUpProyect(){
    this.Oncreated = true;
  }

}
