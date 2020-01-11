import { tallas } from './../../models/tallas';
import { Usuario } from './../../models/usuario';
import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import { MdbTableDirective } from 'angular-bootstrap-md';
import { Router } from "@angular/router";
@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.css']
})

export class ManagementComponent implements OnInit {

  @ViewChild(MdbTableDirective, { static: true })
  mdbTableUsers: MdbTableDirective;
  userInfo: Usuario = new Usuario();
  allUsers: Usuario[] = [];
  tallaVacia: tallas = {
    "idTalla": 3,
    "camisaTalla": "N/A",
    "chaquetaTalla": "N/A",
    "pantalonTalla": "N/A",
    "pieTalla": "N/A"
  };
  editField: string;
  numberOfUsers: number;
  searchText = '';
  previousUser: string;
  mayorEdad: string;

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

  constructor(
    public authService: AuthService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.authService.findByToken()
      .subscribe(res => this.userInfo = res);

    this.authService.findUsuariosByTipo([1, 2, 3])
      .subscribe(res => {
        this.allUsers = res;
        this.mdbTableUsers.setDataSource(this.allUsers);
        this.previousUser = this.mdbTableUsers.getDataSource();
        this.numberOfUsers = this.allUsers.length;

        this.llenaListasVacias();

      });
  }

  /***BUSQUEDA EN LISTAS */

  @HostListener('input') oninput() {
    this.buscarUsuarios();

  }

  obtenerModeloCoche(lista: any): string {
    if (lista.length === 0) {
      return 'N/A';
    } else { return lista[0].modeloCoche; }
  }

  llenaListasVacias() {
    for (let index = 0; index < this.allUsers.length; index++) {
      if (this.allUsers[index].motoList.length === 0) {
        this.allUsers[index].motoList
          .push(
            {
              idMoto: 0,
              colorMoto: 'N/A',
              fotoMoto: 'N/A',
              modeloMoto: 'N/A'
            }
          );
      }

      if (this.allUsers[index].cocheList.length === 0) {
        this.allUsers[index].cocheList
          .push(
            {
              idCoche: 0,
              colorCoche: 'N/A',
              fotoCoche: 'N/A',
              modeloCoche: 'N/A'
            }
          );
      }
    }
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



  /**EDICIONES RAPIDAS */
  updateListUsers(id: number, property: string, event: any) {
    const editField = event.target.ttextContent;
    this.allUsers[id][property] = editField;

    let usuarioEdit: Usuario = this.allUsers[id];

    this.authService.editUser(usuarioEdit)
      .subscribe(
        res => {
          console.log(res);
          usuarioEdit = res;
        }
      );
    console.log('ID EDITABLE: ' + usuarioEdit.username);
  }

  /**IR A EDICION DE USUARIO */
  editarUser(idList: any, userId: any) {
    localStorage.setItem('useredit', userId);
    this.router.navigate(['/useredit']);
  }

  /**ELIMINACION */
  removeUser(idList: any, userId: any) {
    this.allUsers.splice(idList, 1);
    this.authService.deleteUser(userId).subscribe(res => console.log(res));
  }

  changeValue(id: number, property: string, event: any) {
    this.editField = event.target.textContent;

    console.log('change value: ' + this.editField);
  }



}


