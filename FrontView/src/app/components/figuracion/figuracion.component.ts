import { moto } from './../../models/moto';
import { tipoUsuario } from './../../models/tipoUsuario';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { Usuario } from './../../models/usuario';
import { Component, Input, OnDestroy, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { AuthService } from '../../Services/auth.service';
import { Router } from '@angular/router';
import { ErrorStateMatcher } from '@angular/material';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { etnia } from 'src/app/models/etnia';
import { bailarin } from 'src/app/models/bailarin';
import { estilosBaile } from 'src/app/models/estilosBaile';
import { cantante } from 'src/app/models/cantante';
import { estilosCanto } from 'src/app/models/estilosCanto';
import { habilidades } from 'src/app/models/habilidades';
import { idiomas } from 'src/app/models/idiomas';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';

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
  selector: 'app-figuracion',
  templateUrl: './figuracion.component.html',
  styleUrls: ['./figuracion.component.css']
})
export class FiguracionComponent implements OnInit {

  @Input() inputArray;
  @ViewChild(TemplateRef, { static: false }) tpl: TemplateRef<any>;

  /**Constructor */
  constructor(
    private storage: AngularFireStorage,
    private authService: AuthService,
    public ngxSmartModalService: NgxSmartModalService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.createRegisterForm();

  }

  /***variables para carga de imagenes y archivos */
  fileAvatar: File = null;
  fileCoche: File = null;
  fileMoto: File = null;
  fileTatuajes: File = null;
  fileManos: File = null;
  fileCuerpoEntero: File = null;
  fileArtistico: File = null;


  urlAvatar: string;
  urlMoto: string;
  urlCoche: string;
  urlTatuajes: string;
  urlManos: string;
  urlCuerpoEntero: string;
  urlArtistico: string;



  /*******variables para combos********/
  etnias: etnia[];
  baile: bailarin[];
  estilosBaile: estilosBaile[];
  cantante: cantante[];
  estilosCanto: estilosCanto[];
  habilidadess: habilidades[];
  idiomas: idiomas[];
  typecarnet: string[] = ['Tipo A', 'Tipo B', 'Tipo C', 'Tipo D', 'Tipo BTP'];
  //selected
  actorSelect;
  tipoCarnetSelect;
  usuario: Usuario;
  etniaSelect: etnia;
  baileSelect: bailarin;
  estilosBaileSelect: estilosBaile;
  cantanteSelect: cantante;
  estilosCantoSelect: estilosCanto;
  habilidadessSelect: habilidades;
  idiomasSelect: idiomas;
  /*****fin variables combos*****/
  actorForm: FormGroup;
  submitted = false;

  /**Inicializacion */
  ngOnInit() {
    this.llenarCombos();
  }

  llenarCombos() {
    //llenado de etnias
    this.authService.getAllEtinas()
      .subscribe(resp => {
        this.etnias = resp;
      });
    this.authService.finByIdEtnia(1)
      .subscribe(resp => {
        this.etniaSelect = resp;
      });

    //llenado de baile
    this.authService.getAllBailarin()
      .subscribe(resp => {
        this.baile = resp;
      });
    this.authService.finByIdBailarin(1)
      .subscribe(resp => {
        this.baileSelect = resp;
      });

    //llenado de estilos baile
    this.authService.getAllEstilosBailes()
      .subscribe(resp => {
        this.estilosBaile = resp;
      });

    this.authService.finByIdEstilosBile(1)
      .subscribe(resp => {
        this.estilosBaileSelect = resp;
      });

    //llenado de cantate
    this.authService.getAllCantante()
      .subscribe(resp => {
        this.cantante = resp;
      });

    this.authService.finByIdCantante(1)
      .subscribe(resp => {
        this.cantanteSelect = resp;
      });



    //llenado de estilosCanto
    this.authService.getAllEstilosCanto()
      .subscribe(resp => {
        this.estilosCanto = resp;
      });

    this.authService.finByIdEstilosCanto(1)
      .subscribe(resp => {
        this.estilosCantoSelect = resp;
      });

    //llenado de habilidadess
    this.authService.getAllHabilidades()
      .subscribe(resp => {
        this.habilidadess = resp;
      });

    this.authService.finByIdHabilidades(1)
      .subscribe(resp => {
        this.habilidadessSelect = resp;
      });

    //llenado de idiomas
    this.authService.getAllIdiomas()
      .subscribe(resp => {
        this.idiomas = resp;
      });


    this.authService.finByIdIdiomas(1)
      .subscribe(resp => {
        this.idiomasSelect = resp;
      });
  }

  /**Construccion de form match variables y campos */
  createRegisterForm() {
    this.actorForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      confirmPassword: ['', Validators.required],
      username: [''],
      acceptTerms: [false, Validators.required],
      habilidades: [''],
      cantos: [''],
      estilocantos: [''],
      placebirth: [''],
      idiomasHablados: [''],
      nombres: [''],
      apellidos: [''],
      localidad: [''],
      provincia: [''],
      bailes: [''],
      estilobailes: [''],
      codpostal: [''],
      direccion: [''],
      sexo: [''],
      telefono: ['', [Validators.required, Validators.minLength(6)]],
      fechaNacimiento: [''],
      nacionalidad: [''],
      acento: [''],
      tallaPantalon: [''],
      tallaCamisa: [''],
      tallaChaqueta: [''],
      pie: [''],
      altura: [''],
      colorPiel: [''],
      colorPelo: [''],
      colorOjos: [''],
      numeroDNI: [''],
      numeroSeguridadSocial: [''],
      carnetConducir: [''],
      modeloCoche: [''],
      colorCoche: [''],
      fotoCoche: [''],
      modeloMoto: [''],
      colorMoto: [''],
      fotoMoto: [''],
      avatar: [''],
      tattoos: [''],
      manos: [''],
    }
      , {
        validator: MustMatch('password', 'confirmPassword')
      });

  }

  /**Upload avatar */
  onFileAvatarSelected(event) {
    this.fileAvatar = event.target.files[0] as File;
  }
  /**Upload foto cuerpo entero */
  onFileCuerpoEnteroSelected(event) {
    this.fileCuerpoEntero = event.target.files[0] as File;
  }

  /**Upload foto artistica */
  onFileArtisticoSelected(event) {
    this.fileArtistico = event.target.files[0] as File;
  }

  /**Upload foto moto */
  onFileMotoSelected(event) {
    this.fileMoto = event.target.files[0] as File;
  }

  /**Upload foto coche */
  onFileCocheSelected(event) {
    this.fileCoche = event.target.files[0] as File;
  }

  /**Upload foto tatuajes */
  onFileTatuajeSelected(event) {
    this.fileTatuajes = event.target.files[0] as File;
  }

  /**Upload foto manos */
  onFileManoSelected(event) {
    this.fileManos = event.target.files[0] as File;
  }

  pasarDatosFormUsuario() {
    this.submitted = true;
    const newUserObject = this.actorForm.value;

    this.usuario = {
      idUser: 0,
      avatar: this.urlAvatar,
      acento: newUserObject.acento,
      altura: newUserObject.altura,
      apellidos: newUserObject.apellidos,
      carnetConducir: newUserObject.carnetConducir,
      codigoPostal: newUserObject.codpostal,
      colorOjos: newUserObject.colorOjos,
      colorPelo: newUserObject.colorPelo,
      colorPiel: newUserObject.colorPiel,
      curriculumVitae: '',
      direccion: newUserObject.direccion,
      dniMadre: '',
      dniRepresentante: '',
      dniPadre: '',
      dniUser: newUserObject.numeroDNI,
      email: newUserObject.email,
      fechaNacimiento: newUserObject.fechaNacimiento,
      libroFamilia: '',
      localidad: newUserObject.localidad,
      nacionalidad: newUserObject.nacionalidad,
      nombreArtistico: '',
      nombreCompleto: '',
      nombres: newUserObject.nombres,
      numeroSeguroSocial: newUserObject.numeroSeguridadSocial,
      observaciones: '',
      password: newUserObject.password,
      pathDniMadre: '',
      pathDniPadre: '',
      pathDniUser: '',
      pathDniRepresentante: '',
      pathSeguroSocial: '',
      provincia: newUserObject.provincia,
      sexo: newUserObject.sexo,
      telefono: newUserObject.telefono,
      telefonoMadre: '',
      telefonoPadre: '',
      lugarNacimiento: newUserObject.placebirth,
      edad: 0,
      actor: '',
      username: newUserObject.username,
      videobook: '',
      instrumentoList: [],
      estilosCantoList: [this.estilosCantoSelect],
      deporteList: [],
      estiloBaileList: [this.estilosBaileSelect],
      idiomasList: [this.idiomasSelect],
      habilidadesList: [this.habilidadessSelect],
      tallasList: [],
      ultimosTrabajosList: [],
      idCantante: this.cantanteSelect,
      idBailarin: this.baileSelect,
      idEtnia: this.etniaSelect,


      idType: {
        idType: 2,
        description: 'FIGURACION',
        nombres: 'FIGURACION'
      },
      idDeportista: {
        idDeportista: 1,
        descripcionDeportista: 'NO APLICA',
        nombreDeportista: 'NO APLICA'
      },
      idMusico: {
        idMusico: 1,
        descipcionMusico: 'NO APLICA',
        nombreMusico: 'NO APLICA'
      },
      motoList: [],
      cocheList: [],
      fotosTatuajesList: [],
      fotosManosList: []
    };
  }

  registrarFotos(idUser) {
    if (this.urlMoto !== '') {
      let moto = {
        colorMoto: this.actorForm.get('colorMoto').value,
        fotoMoto: this.urlMoto,
        modeloMoto: this.actorForm.get('modeloMoto').value,
        idUser: idUser
      };

      /***GUARDE CON SERVICIO */
      this.authService.saveMoto(moto).subscribe(
        resTalla => {
          console.log('info save moto');
        },
        (err) => {
          console.log('error save moto');
        });
    }

    if (this.urlCoche !== '') {
      let coche = {
        colorCoche: this.actorForm.get('colorCoche').value,
        fotoCoche: this.urlCoche,
        modeloCoche: this.actorForm.get('modeloCoche').value,
        idUser: idUser
      };

      /***GUARDE CON SERVICIO */
      this.authService.saveCoche(coche).subscribe(
        resTalla => {
          console.log('info save coche');
        },
        (err) => {
          console.log('error save coche');
        });
    }

    if (this.urlTatuajes !== '') {
      let fotosTatuajes = {
        fechaCargaTatuaje: new Date(),
        nombreFotoTatuaje: 'tatuaje' + idUser,
        urlFotoTatuaje: this.urlTatuajes,
        idUser: idUser
      };

      /***GUARDE CON SERVICIO */
      this.authService.saveTatuajes(fotosTatuajes).subscribe(
        resTalla => {
          console.log('info save fotosTatuajes');
        },
        (err) => {
          console.log('error save fotosTatuajes');
        });
    }


    if (this.urlManos !== '') {
      let fotosManos = {
        fechaCargaMano: new Date(),
        nombreFotoMano: 'manos' + idUser,
        urlFotoMano: this.urlManos,
        idUser: idUser
      };

      /***GUARDE CON SERVICIO */
      this.authService.saveManos(fotosManos).subscribe(
        resTalla => {
          console.log('info save fotosManos');
        },
        (err) => {
          console.log('error save fotosManos');
        });
    }

  }


  guardarTalla(idUser) {
    const newChild = this.actorForm.value;
    let tallas = {
      camisaTalla: newChild.tallaCamisa,
      chaquetaTalla: newChild.tallaChaqueta,
      pantalonTalla: newChild.tallaPantalon,
      pieTalla: newChild.pie,
      idUser: idUser
    };
    this.authService.saveTalla(tallas).subscribe(
      resTalla => {
        console.log('talla guardada');
      },
      (err) => {
        this.ngxSmartModalService.create('confirm', 'Se ha presentado un Error, vuelva a intentarlo y si el problema persiste, contáctenos').open();
        console.log(JSON.stringify(err));
      });
  }

  registrarActor() {
    this.submitted = true;

    if (this.actorForm.invalid || this.actorForm.get('acceptTerms').value === false) {
      this.ngxSmartModalService.create('confirm', 'Pofavor, Llenar el formulario con todos los datos').open();
      return;
    }
    this.subirArchivos();
    this.pasarDatosFormUsuario();
    this.authService.signup2(this.usuario).subscribe(
      res => {
        localStorage.setItem('token', res.idUser);
        this.ngxSmartModalService.create('confirm', 'Cuenta de Figuración creada exitosamente ' + res.nombres + ' ' + res.apellidos).open();
        this.registrarFotos(res.idUser);
        this.guardarTalla(res.idUser);
        this.router.navigate(['/homeuser']);
      },
      (err) => {
        this.ngxSmartModalService.create('confirm', 'Se ha presentado un Error, vuelva a intentarlo y si el problema persiste, contáctenos').open();
        console.log(JSON.stringify(err));
      });
  }

  subirArchivos() {
    /**subir avatar */
    let idUser = this.actorForm.get('numeroDNI').value;
    this.urlAvatar = 'figuracion/' + idUser + '/avatar-' + this.fileAvatar.name;
    let task = this.storage.upload(this.urlAvatar, this.fileAvatar);

    /**subir cuerpo entero */
    this.urlCuerpoEntero = 'figuracion/' + idUser + '/cuerpo-' + this.fileCuerpoEntero.name;
    task = this.storage.upload(this.urlCuerpoEntero, this.fileCuerpoEntero);

    /**subir foto artistica */
    this.urlArtistico = 'figuracion/' + idUser + '/artistico-' + this.fileArtistico.name;
    task = this.storage.upload(this.urlArtistico, this.fileArtistico);

    /**subir coche */
    this.urlCoche = 'figuracion/' + idUser + '/coche-' + this.fileCoche.name;
    task = this.storage.upload(this.urlCoche, this.fileCoche);

    /**subir moto */
    this.urlMoto = 'figuracion/' + idUser + '/moto-' + this.fileMoto.name;
    task = this.storage.upload(this.urlMoto, this.fileMoto);

    /**subir tatuajes */
    this.urlTatuajes = 'figuracion/' + idUser + '/tatuajes-' + this.fileTatuajes.name;
    task = this.storage.upload(this.urlTatuajes, this.fileTatuajes);

    /**subir manos */
    this.urlManos = 'figuracion/' + idUser + '/manos-' + this.fileManos.name;
    task = this.storage.upload(this.urlManos, this.fileManos);
  }
  /*  Función para permitir solo numeros */
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  /*  Función para no permitir caracteres especiales */
  check(e) {
    const tecla = (document.all) ? e.keyCode : e.which;
    //Tecla de retroceso para borrar, siempre la permite
    if (tecla == 8) {
      return true;
    }
    // Patron de entrada, en este caso solo acepta numeros y letras
    const patron = /[A-Za-z0-9]/;
    const tecla_final = String.fromCharCode(tecla);
    return patron.test(tecla_final);
  }


}
