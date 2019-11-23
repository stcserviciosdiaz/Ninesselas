import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import {AuthService} from '../../Services/auth.service';
import {MdbTableDirective} from 'angular-bootstrap-md';

@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.css']
})
export class ManagementComponent implements OnInit {

  @ViewChild(MdbTableDirective, { static: true }) mdbTable: MdbTableDirective;
  userInfo;
  allUsers;
  allCompanies;
  editField: string;
  headElementsUsers = [
    'ID',
    'Nombres Completos',
    'Mayor de Edad',
    'Nombre Artístico',
    'Género',
    'Alias',
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
    'Raza de Mascota',
    'Últimos Trabajos',
    'Número DNI',
    'Número de Seguridad Social',
    'Correo de Contacto',
    'Contraseña',
    'Teléfono de Contacto',
  ];
  headElementsCompanies = [
    'ID',
    'Nombre de Usuario',
    'Correo',
    'Teléfono de Contacto',
    'Contraseña',
    'Remove'
  ];

  searchText = '';
  previous: string;

  constructor(
    private authService: AuthService,
  ) {
  }

  @HostListener('input') oninput() {
    this.searchItems();
  }

  ngOnInit() {
    this.authService.getAllCompanies()
      .subscribe(resp => {
        this.allCompanies = resp;
      });
    this.authService.getUser()
      .subscribe(res => this.userInfo = res);
    this.authService.getAllUsers()
      .subscribe(res => {
        this.allUsers = res;
      });

    for (const user of this.allUsers) {
      if (user.mayorEdad) {
        user.mayorEdad = 'SI';
      } else {
        user.mayorEdad = 'NO';
      }
    }

    this.mdbTable.setDataSource(this.allUsers);
    this.previous = this.mdbTable.getDataSource();
  }


  searchItems() {
    const prev = this.mdbTable.getDataSource();

    if (!this.searchText) {
      this.mdbTable.setDataSource(this.previous);
      this.allUsers = this.mdbTable.getDataSource();
    }

    if (this.searchText) {
      this.allUsers = this.mdbTable.searchLocalDataBy(this.searchText);
      this.mdbTable.setDataSource(prev);
    }
  }
  updateList(id: number, property: string, event: any) {
    const editField = event.target.textContent;
    this.allCompanies[id][property] = editField;
  }

  remove(id) {
    this.allUsers.splice(id, 1);
    this.authService.deleteUser(id)
      .subscribe(res => console.log(res));
  }

  changeValue(id: number, property: string, event: any) {
    this.editField = event.target.textContent;
  }


}
