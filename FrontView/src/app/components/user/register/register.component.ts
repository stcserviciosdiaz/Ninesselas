import { Usuario } from './../../../models/usuario';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormGroupDirective, NgForm } from '@angular/forms';
import { AuthService } from '../../../Services/auth.service';
import { Router } from '@angular/router';
import { EmailService } from '../../../Services/email.service';
import { ReactiveFormsModule } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { SeoService } from 'src/app/Services/seo.service';
import { Title } from '@angular/platform-browser';

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
  usuario: Usuario;

  username = new FormControl('', Validators.required);
  email = new FormControl('', [Validators.required, Validators.email]);
  telefono = new FormControl('', Validators.required);
  matcher = new MyErrorStateMatcher();

  constructor(
    private title: Title,
    private seo: SeoService,
    private authService: AuthService,
    public ngxSmartModalService: NgxSmartModalService,
    private formBuilder: FormBuilder,
    private router: Router,
    private emailService: EmailService
  ) {
  }

  ngOnInit() {
    let t: string = "Ninesselas - Registros";
    this.title.setTitle(t);

    this.seo.generateTags({
      title: "Ninesselas - Registros",
      description: "Nines Selas Agency",
      slug: "registros"
    });

    this.companyForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern(/^-?[0-9][^\.]*$/)]],
    }
      , {
        validator: MustMatch('password', 'confirmPassword')
      });
  }

  pasarDatosFormUsuario() {

    const newChild = this.companyForm.value;
    console.log('Compania a registrar: ' + JSON.stringify(newChild));
    this.usuario = {
      idUser: 0,
      avatar: "",
      fotoCuerpo: "",
      fotoProfesional: "",
      acento: "",
      altura: 0.0,
      apellidos: "",
      carnetConducir: "",
      tipoCarnetConducir: "",
      codigoPostal: "",
      colorOjos: "",
      colorPelo: "",
      colorPiel: "",
      curriculumVitae: "",
      direccion: "",
      dniMadre: "",
      dniRepresentante: "",
      dniPadre: "",
      dniUser: "",
      email: newChild.email,
      fechaNacimiento: null,
      libroFamilia: "",
      libroFamiliarList: [],
      pathDniMadreB: '',
      pathDniPadreB: '',
      pathDniUserB: '',
      bilingue: "",
      nrocuenta: "",
      localidad: "",
      nacionalidad: "",
      nombreArtistico: "",
      nombreCompleto: "",
      nombres: "",
      numeroSeguroSocial: "",
      observaciones: "",
      password: newChild.password,
      pathDniMadre: "",
      pathDniPadre: "",
      pathDniUser: "",
      pathDniRepresentante: "",
      pathSeguroSocial: "",
      provincia: "",
      sexo: "",
      telefono: newChild.telefono,
      telefonoMadre: "",
      telefonoPadre: "",
      lugarNacimiento: "",
      edad: 0,
      actor: "NO",
      username: newChild.username,
      videobook: "",
      instrumentoList: [],
      estilosCantoList: [],
      deporteList: [],
      estiloBaileList: [],
      idiomasList: [],
      habilidadesList: [],
      tallasList: [],
      ultimosTrabajosList: [],
      idCantante: {
        idCantante: 1,
        descripcionCantante: "NO APLICA",
        nombreCantante: "NOAPLICA"
      },
      idBailarin: {
        idBailarin: 1,
        descripcionBailarin: "NO APLICA",
        nombreBailarin: "NO APLICA"
      },
      idEtnia: {
        idEtnia: 1,
        nombreEtnia: "BLANCO editado"
      },
      idType: {
        idType: 4,
        description: "COMPAÑIA",
        nombres: "COMPAÑIA"
      },
      idDeportista: {
        idDeportista: 1,
        descripcionDeportista: "NO APLICA",
        nombreDeportista: "NO APLICA"
      },
      idMusico: {
        idMusico: 1,
        descipcionMusico: "NO APLICA",
        nombreMusico: "NO APLICA"
      },
      motoList: [],
      cocheList: [],
      fotosTatuajesList: [],
      fotosManosList: []
    }
  }

  registrarEmpresa() {
    this.submitted = true;
    // stop the process here if form is invalid
    if (this.companyForm.invalid) {
      console.log('error form invalid');
      return;
    }

    this.pasarDatosFormUsuario();

    this.authService.signup2(this.usuario)
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
