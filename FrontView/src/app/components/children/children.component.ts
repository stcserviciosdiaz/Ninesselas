import { Usuario } from './../../models/usuario';
import { tallas } from './../../models/tallas';
import { Component, Input, OnDestroy, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { NgxSmartModalService, NgxSmartModalComponent } from 'ngx-smart-modal';
import { AuthService } from '../../Services/auth.service';
import { Router } from '@angular/router';
import { ErrorStateMatcher } from '@angular/material';
import { bailarin } from 'src/app/models/bailarin';
import { estilosBaile } from 'src/app/models/estilosBaile';
import { cantante } from 'src/app/models/cantante';
import { estilosCanto } from 'src/app/models/estilosCanto';
import { habilidades } from 'src/app/models/habilidades';
import { idiomas } from 'src/app/models/idiomas';
import { deportista } from 'src/app/models/deportista';
import { deportes } from 'src/app/models/deportes';
import { musico } from 'src/app/models/musico';
import { instrumento } from 'src/app/models/instrumentos';
import { etnia } from 'src/app/models/etnia';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs/internal/Observable';
import { finalize } from 'rxjs/operators';


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
  selector: 'app-children',
  templateUrl: './children.component.html',
  styleUrls: ['./children.component.css']
})
export class ChildrenComponent implements OnInit {

  matcher = new MyErrorStateMatcher();
  childForm: FormGroup;
  submitted = false;

  isavailable = false;

  avatarFile: File = null;
  copyDNIFather: File = null;
  CopyDNIMother: File = null;
  familyBookFile: File = null;
  copySocialNumber: File = null;
  copyDNIkid: File = null;

  fileData: File = null;
  previewUrl: any = null;
  fileUploadProgress: string = null;
  uploadedFilePath: string = null;

  fileCuerpoEntero: File = null;
  fileArtistico: File = null;

  /***variables para carga de imagenes y archivos */
  uploadPercent: Observable<number>;
  urlImage: Observable<string>;
  urlDniUser: Observable<string>;
  urlSeguroSocialUser: Observable<string>;
  urlDniPdre: Observable<string>;
  urlDniMadre: Observable<string>;
  urlLibroFamiliar: Observable<string>;

  urlAvatar: string;
  urlUsuario: string;
  urlSegurosocial: string;
  urlPadre: string;
  urlMadre: string;
  urlLibroFamilia: string;
  urlRepresentante: string;
  urlCuerpoEntero: string;
  urlArtistico: string;

  /*******variables para combos********/
  edad = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
  actor = [{ name: 'Si', }, { name: 'No', },];
  etnias;
  baile;
  estilosBaile;
  cantante;
  estilosCanto;
  habilidadess;
  idiomas;
  deportista;
  deportes;
  musico;
  instrumentoss;

  //selected
  actorSelect;
  usuario: Usuario;
  usuarioEdit: Usuario;
  etniaSelect: etnia;
  baileSelect: bailarin;
  estilosBaileSelect: estilosBaile;
  cantanteSelect: cantante;
  estilosCantoSelect: estilosCanto;
  habilidadessSelect: habilidades;
  idiomasSelect: idiomas;
  deportistaSelect: deportista;
  deporteSelect: deportes;
  musicoSelect: musico;
  instrumentoSelect: instrumento;
  /*****fin variables combos*****/

  @ViewChild(TemplateRef, { static: false }) tpl: TemplateRef<any>;

  constructor(
    private storage: AngularFireStorage,
    private http: HttpClient,
    private authService: AuthService,
    public ngxSmartModalService: NgxSmartModalService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {

  }

  ngOnInit() {
    this.llenarCombos();
    this.childForm = this.formBuilder.group({
      /****variables nuevas */
      etnias: [''],
      baile: [''],
      estilosBaile: [''],
      cantante: [''],
      estilosCanto: [''],
      habilidadess: [''],
      idiomas: [''],
      deportista: [''],
      deportes: [''],
      musico: [''],
      instrumentoss: [''],
      /****fin variables nuevas */
      username: ['', Validators.required],
      nombres: ['', [Validators.required, Validators.minLength(5)]],
      acceptTerms: [false, Validators.requiredTrue],
      apellidos: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      sexo: [''],
      actor: [''],
      videoBook: [''],
      estilocantos: [''],
      habdeportes: [''],
      deporte: [''],
      placebirth: [''],
      estilobailes: [''],
      bailes: [''],
      etnico: [''],
      edad: [''],
      codpostal: [''],
      musicos: [''],
      telefono: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
      telefonofather: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
      telefonomother: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
      fechaNacimiento: ['', Validators.required],
      nacionalidad: [''],
      acento: [''],
      tallaPantalon: [''],
      tallaCamisa: [''],
      tallaChaqueta: [''],
      localidad: [''],
      provincia: [''],
      direccion: [''],
      pie: [''],
      cantos: [''],
      habilidades: [''],
      idiomasHablados: [''],
      altura: [''],
      instrumentos: [''],
      colorPiel: [''],
      colorPelo: [''],
      colorOjos: [''],
      observaciones: [''],
      numeroDNI: ['', Validators.required],
      numeroSeguridadSocial: [''],
      numeroDNIPadre: [''],
      numeroDNIMadre: [''],
      numeroDNIRepresentante: [''],
      ultimosTrabajos: [''],
      avatar: [''],
      copyDNIFather: [''],
      CopyDNIMother: [''],
      copySocialNumber: [''],
      copyDNIkid: [''],
      libroFamilia: [''],
    }

      , {
        validator: MustMatch('password', 'confirmPassword')
      });
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

    //llenado de deportista
    this.authService.getAllDeportista()
      .subscribe(resp => {
        this.deportista = resp;
      });

    this.authService.finByIdDeportista(1)
      .subscribe(resp => {
        this.deportistaSelect = resp;
      });

    //llenado de deportes
    this.authService.getAllDeportes()
      .subscribe(resp => {
        this.deportes = resp;
      });

    this.authService.finByIdDeportes(1)
      .subscribe(resp => {
        this.deporteSelect = resp;
      });

    //llenado de musico
    this.authService.getAllMusico()
      .subscribe(resp => {
        this.musico = resp;
      });

    this.authService.finByIdMusico(1)
      .subscribe(resp => {
        this.musicoSelect = resp;
      });

    //llenado de instrumento
    this.authService.getAllInstrumentos()
      .subscribe(resp => {
        this.instrumentoss = resp;
      });

    this.authService.finByIdInstrumento(1)
      .subscribe(resp => {
        this.instrumentoSelect = resp;
      });
  }

  guardarTalla(idUser) {
    const newChild = this.childForm.value;
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

  pasarDatosFormUsuario() {

    const newChild = this.childForm.value;
    console.log('Niño a registrar: ' + JSON.stringify(newChild));
    this.usuario = {
      idUser: 0,
      avatar: this.urlAvatar,
      acento: newChild.acento,
      altura: newChild.altura,
      apellidos: newChild.apellidos,
      carnetConducir: newChild.carnetConducir,
      codigoPostal: newChild.codpostal,
      colorOjos: newChild.colorOjos,
      colorPelo: newChild.colorPelo,
      colorPiel: newChild.colorPiel,
      curriculumVitae: newChild.curriculumVitae,
      direccion: newChild.direccion,
      dniMadre: newChild.numeroDNIMadre,
      dniRepresentante: newChild.numeroDNIRepresentante,
      dniPadre: newChild.numeroDNIPadre,
      dniUser: newChild.numeroDNI,
      email: newChild.email,
      fechaNacimiento: newChild.fechaNacimiento,
      libroFamilia: this.urlLibroFamilia,
      localidad: newChild.localidad,
      nacionalidad: newChild.nacionalidad,
      nombreArtistico: newChild.nombreArtistico,
      nombreCompleto: '',
      nombres: newChild.nombres,
      numeroSeguroSocial: newChild.numeroSeguridadSocial,
      observaciones: '',
      password: newChild.password,
      pathDniMadre: this.urlMadre,
      pathDniPadre: this.urlPadre,
      pathDniUser: this.urlUsuario,
      pathDniRepresentante: this.urlRepresentante,
      pathSeguroSocial: this.urlSegurosocial,
      provincia: newChild.provincia,
      sexo: newChild.sexo,
      telefono: newChild.telefono,
      telefonoMadre: newChild.telefonomother,
      telefonoPadre: newChild.telefonofather,
      lugarNacimiento: newChild.placebirth,
      edad: newChild.edad,
      actor: newChild.actor,
      username: newChild.username,
      videobook: newChild.videoBook,
      instrumentoList: [this.instrumentoSelect],
      estilosCantoList: [this.estilosCantoSelect],
      deporteList: [this.deporteSelect],
      estiloBaileList: [this.estilosBaileSelect],
      idiomasList: [this.idiomasSelect],
      habilidadesList: [this.habilidadessSelect],
      tallasList: [],
      ultimosTrabajosList: [],
      idCantante: this.cantanteSelect,
      idBailarin: this.baileSelect,
      idEtnia: this.etniaSelect,
      idType: {
        idType: 3,
        description: 'NIÑOS',
        nombres: 'NIÑOS'
      },
      idDeportista: this.deportistaSelect,
      idMusico: this.musicoSelect,
      motoList: [],
      cocheList: [],
      fotosTatuajesList: [],
      fotosManosList: []
    };

  }

  signupChild() {

    this.submitted = true;

    if (this.childForm.invalid || this.childForm.get('acceptTerms').value === false) {
      this.ngxSmartModalService.create('confirm', 'Pofavor, Llenar el formulario con todos los datos').open();
      return;
    }
    this.subirArchivos();
    this.pasarDatosFormUsuario();
    this.authService.signup2(this.usuario).subscribe(
      res => {
        localStorage.setItem('token', res.idUser);
        this.ngxSmartModalService.create('confirm', 'Cuenta de Niño creada exitosamente ' + res.nombres + ' ' + res.apellidos).open();
        this.router.navigate(['/homeuser']);
        this.guardarTalla(res.idUser);
      },
      (err) => {
        this.ngxSmartModalService.create('confirm', 'Se ha presentado un Error, vuelva a intentarlo y si el problema persiste, contáctenos').open();
        console.log(JSON.stringify(err));
      });
  }

  onAvatarSelected(event) {
    this.avatarFile = event.target.files[0] as File;
  }

  /**Upload foto cuerpo entero */
  onFileCuerpoEnteroSelected(event) {
    this.fileCuerpoEntero = event.target.files[0] as File;
  }

  /**Upload foto artistica */
  onFileArtisticoSelected(event) {
    this.fileArtistico = event.target.files[0] as File;
  }


  fileProgress(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0];
    this.preview();
  }

  preview() {
    // Show preview
    var mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    var reader = new FileReader();
    reader.readAsDataURL(this.fileData);
    reader.onload = (_event) => {
      this.previewUrl = reader.result;
    }
  }

  subirArchivos() {
    /**subir avatar */
    let idUser = this.childForm.get('numeroDNI').value;
    this.urlAvatar = 'ninios/' + idUser + '/avatar-' + this.avatarFile.name;
    let task = this.storage.upload(this.urlAvatar, this.avatarFile);

    /**subir cuerpo entero */
    this.urlCuerpoEntero = 'ninios/' + idUser + '/cuerpo-' + this.fileCuerpoEntero.name;
    task = this.storage.upload(this.urlCuerpoEntero, this.fileCuerpoEntero);

    /**subir foto artistica */
    this.urlArtistico = 'ninios/' + idUser + '/artistico-' + this.fileArtistico.name;
    task = this.storage.upload(this.urlArtistico, this.fileArtistico);

    /**subir dnipadre */
    this.urlPadre = 'ninios/' + idUser + '/dnipadre-' + this.copyDNIFather.name;
    task = this.storage.upload(this.urlPadre, this.copyDNIFather);

    /**subir dnimadre */
    this.urlMadre = 'ninios/' + idUser + '/dnimadre-' + this.CopyDNIMother.name;
    task = this.storage.upload(this.urlMadre, this.CopyDNIMother);

    /**subir family book  */
    this.urlLibroFamilia = 'ninios/' + idUser + '/librofamiliar-' + this.familyBookFile.name;
    task = this.storage.upload(this.urlLibroFamilia, this.familyBookFile);

    /**subir numero de seguro social  */
    this.urlSegurosocial = 'ninios/' + idUser + '/segurosocial-' + this.copySocialNumber.name;
    task = this.storage.upload(this.urlSegurosocial, this.copySocialNumber);

    /**subir dni user  */
    this.urlUsuario = 'ninios/' + idUser + '/dniuser-' + this.copyDNIkid.name;
    task = this.storage.upload(this.urlUsuario, this.copyDNIkid);

  }

  copyDNIFatherSelected(event) {
    this.copyDNIFather = event.target.files[0] as File;
  }

  copyDNIMotherSelected(event) {
    this.CopyDNIMother = event.target.files[0] as File;
  }

  onFamilyBookSelected(event) {
    this.familyBookFile = event.target.files[0] as File;
  }

  copySocialNumberSelected(event) {
    this.copySocialNumber = event.target.files[0] as File;
  }

  copyDNIkidSelected(event) {
    this.copyDNIkid = event.target.files[0] as File;
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
