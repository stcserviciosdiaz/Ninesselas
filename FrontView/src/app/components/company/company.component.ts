import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import {AuthService} from '../../Services/auth.service';
import {MdbTableDirective} from 'angular-bootstrap-md';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})

export class CompanyComponent implements OnInit {
  @ViewChild(MdbTableDirective, { static: true }) mdbTable: MdbTableDirective;
  companyInfo;
  allUsers;
  headElements = [
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
    'Teléfono de Contacto',
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
    this.authService.getUser().subscribe(res => this.companyInfo = res);
    this.authService.getAllUsers()
      .subscribe(res => {
        this.allUsers = res;
        alert(JSON.stringify(res));
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



}
