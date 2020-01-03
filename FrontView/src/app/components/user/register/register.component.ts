import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormGroup, FormControl, Validators, FormBuilder, FormGroupDirective, NgForm} from '@angular/forms';
import {AuthService} from '../../../Services/auth.service';
import {Router} from '@angular/router';
import { EmailService } from '../../../Services/email.service';
import {ReactiveFormsModule} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { NgxSmartModalService } from 'ngx-smart-modal';

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
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})



export class RegisterComponent implements OnInit {
  companyForm: FormGroup;
  submitted = false;

  username = new FormControl('', Validators.required);
  email = new FormControl('', [Validators.required, Validators.email]);
  telefono = new FormControl('', Validators.required);
  matcher = new MyErrorStateMatcher();

  constructor(
    private authService: AuthService,
    public ngxSmartModalService: NgxSmartModalService,
    private formBuilder: FormBuilder,
    private router: Router,
    private emailService: EmailService
    ) {
  }

  ngOnInit() {
    this.companyForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)], Validators.maxLength(9)],
      confirmPassword: ['',Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['',[Validators.required, Validators.pattern(/^-?[0-9][^\.]*$/)]],
    }
    , {
      validator: MustMatch('password', 'confirmPassword')
    });
  }



  registrarEmpresa() {
    this.submitted = true;
    // stop the process here if form is invalid
    if (this.companyForm.invalid) {
      return;
    }

    const newUserObject = this.companyForm.value;


    const usuario = {
      "acento": newUserObject.acento,
      "altura": newUserObject.altura,
      "apellidos": newUserObject.apellidos,
      "carnetConducir": newUserObject.carnetConducir,
      "codigoPostal": newUserObject.codpostal,
      "colorOjos": newUserObject.colorOjos,
      "colorPelo": newUserObject.colorPelo,
      "colorPiel": newUserObject.colorPiel,
      "curriculumVitae": '',
      "direccion": newUserObject.direccion,
      "dniMadre": '',
      "dniRepresentante": '',
      "dniPadre": '',
      "dniUser": newUserObject.numeroDNI,
      "email": newUserObject.email,
      "fechaNacimiento": newUserObject.fechaNacimiento,
      "libroFamilia": '',
      "localidad": newUserObject.localidad,
      "nacionalidad": newUserObject.nacionalidad,
      "nombreArtistico": newUserObject.nombreArtistico,
      "nombreCompleto": '',
      "nombres": newUserObject.nombres,
      "numeroSeguroSocial": newUserObject.numeroSeguridadSocial,
      "observaciones": newUserObject.observaciones,
      "password": newUserObject.password,
      "pathDniMadre": '',
      "pathDniPadre": '',
      "pathDniUser": '',
      "pathDniRepresentante": '',
      "pathSeguroSocial": '',
      "provincia": newUserObject.provincia,
      "sexo": newUserObject.sexo,
      "telefono": newUserObject.telefono,
      "telefonoMadre": '',
      "telefonoPadre": '',
      "lugarNacimiento": newUserObject.lugarNacimiento,
      "edad": 0,
      "actor": '',
      "username": newUserObject.username,
      "videobook": newUserObject.videoBook,
      "instrumentoList": [],
      "estilosCantoList": [],
      "deporteList": [
        {
          "idDeporte": 1,
          "descripcionDeporte": "NO APLICA",
          "nombreDeporte": "NO APLICA"
        }
      ],
      "estiloBaileList": [],
      "idiomasList": [],
      "habilidadesList": [],
      "tallasList": [],
      "ultimosTrabajosList": [],
      "idCantante": {
        "idCantante": 1,
        "descripcionCantante": "NO APLICA",
        "nombreCantante": "NOAPLICA"
      },
      "idBailarin": {
        "idBailarin": 1,
        "descripcionBailarin": "NO APLICA",
        "nombreBailarin": "NO APLICA"
      },
      "idEtnia": {
        "idEtnia": 1,
        "nombreEtnia": "BLANCO editado"
      },
      "idType": {
        "idType": 4,
        "description": "COMPAÑIA",
        "nombres": "COMPAÑIA"
      },
      "idDeportista": {
        "idDeportista": 1,
        "descripcionDeportista": "NO APLICA",
        "nombreDeportista": "NO APLICA"
      },
      "idMusico": {
        "idMusico": 1,
        "descipcionMusico": "NO APLICA",
        "nombreMusico": "NO APLICA"
      },
      "motoList": [],
      "cocheList": [],
      "fotosTatuajesList": [],
      "fotosManosList": []
    }
    newUserObject.rol = 'Company';
    this.authService.signup2(usuario)
      .subscribe(
       res => {
         localStorage.setItem('token', res.idUser);
         this.ngxSmartModalService.create('confirm', 'Cuenta de Companía creada exitosamente').open();
         this.router.navigate(['/company']);
         },
      (err) => {
        this.ngxSmartModalService.create('confirm', 'Se ha presentado un Error, vuelva a intentarlo y si el problema persiste, contáctenos').open();
        //console.log(JSON.stringify(err));
       });
  }

  /*  Función para permitir solo numeros */
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }


}
