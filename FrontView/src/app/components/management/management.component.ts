import { tallas } from './../../models/tallas';
import { Usuario } from './../../models/usuario';
import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import { MdbTableDirective } from 'angular-bootstrap-md';
import { Router } from "@angular/router";
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { NgxSmartModalService } from 'ngx-smart-modal';
export function MustMatch(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];

    if (matchingControl.errors && !matchingControl.errors.mustMatch) {
      // return if another validator has already found an error on the matchingControl
      return;
    }

    // set error on matchingControl if validation fails
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ mustMatch: true });
    } else {
      matchingControl.setErrors(null);
    }
  };
}
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

  constructor(
    public ngxSmartModalService: NgxSmartModalService,
    private formBuilder: FormBuilder,
    public authService: AuthService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.iniciarFormCambioPass();

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
        this.llenaListasVacias();

      });
  }

  /**Iniciar FORM CAMBIO PASS */
  iniciarFormCambioPass() {
    this.validatingForm = this.formBuilder.group({
      modalFormRegisterEmail: new FormControl('', Validators.email),
      modalFormRegisterPassword: new FormControl('', Validators.required),
      modalFormRegisterRepeatPassword: new FormControl('', Validators.required)
    }
      , {
        validator: MustMatch('modalFormRegisterPassword', 'modalFormRegisterRepeatPassword')
      });
  }

  /***BUSQUEDA EN LISTAS */
  @HostListener('input') oninput() {
    this.buscarUsuarios();
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

  /**Update PasswordUsuario */
  pasarUsuarioUpdatePassword(user) {
    this.validatingForm.controls.modalFormRegisterEmail.setValue(user.email);
    this.idUserToUpdatePass = user.idUser;
  }
  actualizarPassword() {
    if (this.validatingForm.invalid) {
      this.ngxSmartModalService.create('Password', 'Contraseñas no coinciden').open();
      return;
    }
    this.passtoUpdate = this.validatingForm.get('modalFormRegisterPassword').value;
    this.authService.editUserPassword(this.passtoUpdate, this.idUserToUpdatePass)
      .subscribe(
        res => {
          this.ngxSmartModalService.create('Password', 'Clave Actualizada Exitosamente').open();
        }
      );
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
  }

  /**IR A EDICION DE USUARIO */
  editarUser(idList: any, user: any) {
    localStorage.setItem('useredit', user.idUser);
    if (user.idType.nombres === 'FIGURACION') {
      this.router.navigate(['/figuracionedit']);
      localStorage.setItem('figuracionedit', user.idUser);
    } else if (user.idType.nombres === 'ACTOR') {
      this.router.navigate(['/actoredit']);
      localStorage.setItem('actoredit', user.idUser);
    } else if (user.idType.nombres === 'NIÑOS') {
      this.router.navigate(['/ninioedit']);
      localStorage.setItem('ninioedit', user.idUser);
    }
  }

  /**ELIMINACION */
  removeUser(idList: any, userId: any) {
    this.allUsers.splice(idList, 1);
    this.authService.deleteUser(userId).subscribe(res => console.log(res));
  }

  changeValue(id: number, property: string, event: any) {
    this.editField = event.target.textContent;
  }


  /***GETTERS */
  get modalFormRegisterEmail() {
    return this.validatingForm.get('modalFormRegisterEmail');
  }

  get modalFormRegisterPassword() {
    return this.validatingForm.get('modalFormRegisterPassword');
  }

  get modalFormRegisterRepeatPassword() {
    return this.validatingForm.get('modalFormRegisterRepeatPassword');
  }

}


