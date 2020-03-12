import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import { MdbTableDirective } from 'angular-bootstrap-md';
import { Usuario } from 'src/app/models/usuario';
import { SeoService } from 'src/app/Services/seo.service';
import { Title } from '@angular/platform-browser';
import { FormControl, Validators, FormGroup, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material';


export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

// custom validator to check that two fields match
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
  }
}


@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})

export class CompanyComponent implements OnInit {
  emailFormControl = new FormControl('', [
    //Validators.required,
    Validators.email,
  ]);

  matcher = new MyErrorStateMatcher();

  @ViewChild(MdbTableDirective, { static: true }) mdbTable: MdbTableDirective;
  companyInfo;
  allUsers: Usuario[];
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
  mayorEdad: any;

  constructor(
    private title: Title,
    private seo: SeoService,
    public authService: AuthService,
  ) {
  }

  @HostListener('input') oninput() {
    this.searchItems();
  }

  ngOnInit() {
    let t:string = "Ninesselas - Empresas";
    this.title.setTitle(t);

    this.seo.generateTags({
      title: "Ninesselas - Empresas",
      description: "Nines Selas Agency",
      slug: "empresas"
    });

    this.authService.findByToken()
      .subscribe(res => this.companyInfo = res);
    this.authService.getAllUsers()
      .subscribe(res => {
        this.allUsers = res;
        for (const user of this.allUsers) {
          if (user.edad >= 18) {
            this.mayorEdad = 'SI';
          } else {
            this.mayorEdad = 'NO';
          }
        }
        this.mdbTable.setDataSource(this.allUsers);
        this.previous = this.mdbTable.getDataSource();
      });



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
