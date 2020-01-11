import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { AuthService } from 'src/app/Services/auth.service';
import { Usuario } from 'src/app/models/usuario';
import { MdbTableDirective } from 'angular-bootstrap-md';

@Component({
  selector: 'app-management-company',
  templateUrl: './management-company.component.html',
  styleUrls: ['./management-company.component.css']
})
export class ManagementCompanyComponent implements OnInit {

  @ViewChild(MdbTableDirective, { static: true })
  mdbTableCompany: MdbTableDirective;
  allCompanies: Usuario[] = [];
  editField: string;
  searchText2 = '';
  previousCompany: string;
  headElementsCompanies = [
    'ID',
    'Nombre de Usuario',
    'Correo',
    'Teléfono de Contacto',
    'Contraseña',
    'Eliminar'
  ];
  constructor(public authService: AuthService,
  ) { }

  ngOnInit() {
    this.authService.findUsuariosByTipo([4])
      .subscribe(resp => {
        this.allCompanies = resp;
        this.mdbTableCompany.setDataSource(this.allCompanies);
        this.previousCompany = this.mdbTableCompany.getDataSource();

      });
  }

  @HostListener('input') oninput() {


    this.buscarCompanias();

  }

  buscarCompanias() {
    const prev = this.mdbTableCompany.getDataSource();

    if (!this.searchText2) {
      this.mdbTableCompany.setDataSource(this.previousCompany);
      this.allCompanies = this.mdbTableCompany.getDataSource();
    }

    if (this.searchText2) {
      this.allCompanies = this.mdbTableCompany.searchLocalDataBy(this.searchText2);
      this.mdbTableCompany.setDataSource(prev);
    }
  }


  updateListCompany(id: number, property: string, event: any) {
    const editField = event.target.textContent;
    this.allCompanies[id][property] = editField;

    let usuarioEdit: Usuario = this.allCompanies[id];

    this.authService.editUser(usuarioEdit)
      .subscribe(
        res => {
          console.log(res);
          usuarioEdit = res;
        }
      );
    console.log('ID EDITABLE: ' + usuarioEdit.username);
  }

  removeCompany(idList: any, userId: any) {
    this.allCompanies.splice(idList, 1);
    this.authService.deleteUser(userId).subscribe(res => console.log(res));


  }

  changeValue(id: number, property: string, event: any) {
    this.editField = event.target.textContent;

    console.log('change value: ' + this.editField);
  }



}
