import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
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
    this.authService.findByToken()
      .subscribe(res => {
        this.userInfo = res;
      }, (err) => {
        this.userInfo = new Usuario();
      });

    this.authService.findUsuariosByTipo([1, 2, 3])
      .subscribe(res => {
        this.allUsers = res;
        this.mdbTableUsers.setDataSource(this.allUsers);
        this.previousUser = this.mdbTableUsers.getDataSource();
        this.numberOfUsers = this.allUsers.length;

      });
  }

  /***BUSQUEDA EN LISTAS */
  @HostListener('input') oninput() {
    this.buscarUsuarios();
  }

  buscarUsuarios() {
    const prev = this.mdbTableUsers.getDataSource();
    if (!this.searchText) {
      this.mdbTableUsers.setDataSource(this.previousUser);
      this.allUsers = this.mdbTableUsers.getDataSource();
    }
    if (this.searchText) {
      this.allUsers = this.mdbTableUsers.searchLocalDataBy(this.searchText);
      this.mdbTableUsers.setDataSource(prev);
    }
  }

}
