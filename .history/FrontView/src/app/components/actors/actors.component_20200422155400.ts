
import { deportes } from './../../models/deportes';
import { Component, NgModule, Input, OnDestroy, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ErrorStateMatcher, MatRadioChange, DateAdapter } from '@angular/material';
import { invalid } from '@angular/compiler/src/render3/view/util';
import { NgxSmartModalService, NgxSmartModalComponent } from 'ngx-smart-modal';
import { AuthService } from '../../Services/auth.service';
import { Usuario } from 'src/app/models/usuario';
import { bailarin } from 'src/app/models/bailarin';
import { estilosBaile } from 'src/app/models/estilosBaile';
import { cantante } from 'src/app/models/cantante';
import { estilosCanto } from 'src/app/models/estilosCanto';
import { habilidades } from 'src/app/models/habilidades';
import { idiomas } from 'src/app/models/idiomas';
import { AngularFireStorage } from '@angular/fire/storage';
import { deportista } from 'src/app/models/deportista';
import { musico } from 'src/app/models/musico';
import { instrumento } from 'src/app/models/instrumentos';
import { etnia } from 'src/app/models/etnia';
import { EmailService } from 'src/app/Services/email.service';
import { Email } from 'src/app/models/email';
import { SeoService } from 'src/app/Services/seo.service';
import { Title } from '@angular/platform-browser';
import { coche } from 'src/app/models/coche';
import { moto } from 'src/app/models/moto';

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
  selector: 'app-actors',
  templateUrl: './actors.component.html',
  styleUrls: ['./actors.component.css']
})
export class ActorsComponent implements OnInit {

  @ViewChild(TemplateRef, { static: false }) tpl: TemplateRef<any>;

  actorForm: FormGroup;
  submitted = false;
  disa = false;
  matcher = new MyErrorStateMatcher();
  hide = true;
  LinktattoSelect;
  WorkingSelect


  /***variables para carga de imagenes y archivos */
  fileAvatar: File = null;
  fileCoche: File = null;
  fileMoto: File = null;
  fileTatuajes: File = null;
  fileManos: File = null;
  fileCuerpoEntero: File = null;
  fileArtistico: File = null;
  fileDNIA: File = null;
  fileDNIB: File = null;
  fileSeguroSocial: File = null;

  urlsTatuajes = [];
  urlsManos = [];
  urlsCoches = [];
  urlsMotos = [];

  listCoches: coche[] = [];
  listMotos: moto[] = [];

  tatuajeFileList: File[] = [];
  manosFileList: File[] = [];
  cochesFileList: File[] = [];
  motosFileList: File[] = [];


  previewAvatar: any = null;
  previewCuerpo: any = null;
  previewArtistico: any = null;
  previewManos: any = null;
  previewDNIA: any = null;
  previewDNIB: any = null;
  previewMoto: any = null;
  previewCoche: any = null;
  previewSeguroSocial: any = null;

  urlAvatar: string;
  urlMoto: string;
  urlCoche: string;
  urlTatuajes: string;
  urlManos: string;
  urlCuerpoEntero: string;
  urlArtistico: string;

  urlUsuarioA: string;
  urlUsuarioB: string;
  urlSeguroSocial: string;

  tamanioFotos = 4;//MB
  date;

  /*******variables para combos********/
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
  typecarnet: string[] = ['Tipo A', 'Tipo B', 'Tipo C', 'Tipo D', 'Tipo BTP'];
  actor = [{ name: 'Si', value: 0 }, { name: 'No', value: 1 }];
  tattos: string[] = ['Si', 'No'];
  Models: string[] = ['Si', 'No'];
  //selected
  actorSelect;
  tipoCarnetSelect;
  etniaSelect: etnia = new etnia();
  usuario: Usuario = new Usuario();
  baileSelect: bailarin = new bailarin();
  estilosBaileSelect: estilosBaile[] = [];
  cantanteSelect: cantante = new cantante();
  estilosCantoSelect: estilosCanto[] = [];
  habilidadessSelect: habilidades[] = [];
  idiomasSelect: idiomas[] = [];
  deportistaSelect: deportista = new deportista();
  deporteSelect: deportes[] = [];
  musicoSelect: musico = new musico();
  instrumentoSelect: instrumento[] = [];
  /*****fin variables combos*****/
  constructor(
    private title: Title,
    private seo: SeoService,
    private storage: AngularFireStorage,
    private authService: AuthService,
    private emailService: EmailService,
    public ngxSmartModalService: NgxSmartModalService,
    private formBuilder: FormBuilder,
    private router: Router,

  ) {
    this.createRegisterForm();
  }
  ngOnInit() {
    let t: string = "Ninesselas - Actores";
    this.title.setTitle(t);

    this.seo.generateTags({
      title: "Ninesselas - Actores",
      description: "Nines Selas Agency",
      slug: "actores"
    });

    this.llenarCombos();
  }



  /**Verifica tamanio y tipo de archivo */
  verificaTamanioTypeFile(file: any) {
    let archivo;
    if (file.size <= (this.tamanioFotos * 1048576)) {
      if (file.type.match(/image\/*/) != null) {
        archivo = file;
      } else {
        archivo = null;
        this.ngxSmartModalService.create('filetype', 'Tipo de Foto no aceptada, intente con formatos (.png, .jpg, .jpeg)').open();
      }
    } else {
      archivo = null;
      this.ngxSmartModalService.create('filesize', 'Tamaño de Foto no aceptada, tamaño máximo de ' + this.tamanioFotos + 'MB').open();
    }
    return archivo;
  }

  /**Upload avatar */
  onFileAvatarSelected(event) {
    let file: File = event.target.files[0] as File;
    this.fileAvatar = this.verificaTamanioTypeFile(file);
    this.verAvatar();
  }

  deleteAvatar() {
    this.fileAvatar = null;
    this.previewAvatar = "";
  }

  verAvatar() {
    // Show preview
    var mimeType = this.fileAvatar.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    var reader = new FileReader();
    reader.readAsDataURL(this.fileAvatar);
    reader.onload = (_event) => {
      this.previewAvatar = reader.result;
    }
  }

  /**Upload foto cuerpo entero */
  onFileCuerpoEnteroSelected(event) {
    let file: File = event.target.files[0] as File;
    this.fileCuerpoEntero = this.verificaTamanioTypeFile(file);
    this.verCuerpo();

  }

  deleteCuerpo() {
    this.fileCuerpoEntero = null;
    this.previewCuerpo = "";
  }

  verCuerpo() {
    // Show preview
    var mimeType = this.fileCuerpoEntero.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    var reader = new FileReader();
    reader.readAsDataURL(this.fileCuerpoEntero);
    reader.onload = (_event) => {
      this.previewCuerpo = reader.result;
    }
  }

  /**Upload foto artistica */
  onFileArtisticoSelected(event) {
    let file: File = event.target.files[0] as File;
    this.fileArtistico = this.verificaTamanioTypeFile(file);
    this.verArtista();
  }

  deleteArtistico() {
    this.fileArtistico = null;
    this.previewArtistico = "";
  }

  verArtista() {
    // Show preview
    var mimeType = this.fileArtistico.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    var reader = new FileReader();
    reader.readAsDataURL(this.fileArtistico);
    reader.onload = (_event) => {
      this.previewArtistico = reader.result;
    }
  }

  /**Upload foto moto */
  onFileMotoSelected(event) {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {

        let fileUpload = this.verificaTamanioTypeFile(event.target.files[i]);

        if (fileUpload !== null) {
          var reader = new FileReader();
          reader.onload = (event1: any) => {
            console.log(event1.target.result);
            this.urlsMotos.push(event1.target.result);
            this.motosFileList.push(event.target.files[i]);
          }
          reader.readAsDataURL(event.target.files[i]);
        }
      }
    }
  }

  aceptarMoto(indexMotoFile: any) {
    const object = this.actorForm.value;
    let idUser = this.actorForm.get('numeroDNI').value;
    let urlMoto = 'actor/' + idUser + '/moto-' + this.motosFileList[indexMotoFile].name;

    let moto = {
      idMoto: 0,
      colorMoto: object.colorMoto,
      fotoMoto: urlMoto,
      modeloMoto: object.modeloMoto,
    };

    if (!this.listMotos.indexOf(indexMotoFile)) {
      this.listMotos.push(moto);
    } else { this.listMotos[indexMotoFile] = moto; }
    console.log('DATOS MOTO ARRAY: ' + JSON.stringify(this.listMotos));

  }

  verNombreMotoPage(indexPage: any): string {
    let nombreImagen = this.motosFileList[indexPage].name;
    return nombreImagen;
  }

  deleteMotoPage(index: any) {
    this.urlsMotos.splice(index, 1);
    this.motosFileList.splice(index, 1);
    this.listMotos.splice(index, 1);

  }


  /**Upload foto coche */
  onFileCocheSelected(event) {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {

        let fileUpload = this.verificaTamanioTypeFile(event.target.files[i]);

        if (fileUpload !== null) {
          var reader = new FileReader();
          reader.onload = (event1: any) => {
            console.log(event1.target.result);
            this.urlsCoches.push(event1.target.result);
            this.cochesFileList.push(event.target.files[i]);
          }
          reader.readAsDataURL(event.target.files[i]);
        }
      }
    }
  }

  verNombreCochePage(indexPage: any): string {
    let nombreImagen = this.cochesFileList[indexPage].name;
    return nombreImagen;
  }

  deleteCochePage(index: any) {
    this.urlsCoches.splice(index, 1);
    this.cochesFileList.splice(index, 1);

    this.listCoches.splice(index, 1);

  }



  aceptarCoche(indexCocheFile: any) {
    const object = this.actorForm.value;
    let idUser = this.actorForm.get('numeroDNI').value;
    let urlCoche = 'actor/' + idUser + '/coche-' + this.cochesFileList[indexCocheFile].name;
    let coche = {
      idCoche: 0,
      colorCoche: object.colorCoche,
      fotoCoche: urlCoche,
      modeloCoche: object.modeloCoche,
    };

    if (!this.listCoches.indexOf(indexCocheFile)) {
      this.listCoches.push(coche);
    } else { this.listCoches[indexCocheFile] = coche; }
    console.log('DATOS COCHE ARRAY: ' + JSON.stringify(this.listCoches));

  }

  /**Upload foto tatuajes */
  onFileTatuajeSelected(event) {

    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {

        let fileUpload = this.verificaTamanioTypeFile(event.target.files[i]);

        if (fileUpload !== null) {
          var reader = new FileReader();
          reader.onload = (event1: any) => {
            console.log(event1.target.result);
            this.urlsTatuajes.push(event1.target.result);
            this.tatuajeFileList.push(event.target.files[i]);
          }
          reader.readAsDataURL(event.target.files[i]);
        }
      }
    }
  }

  verNombreTatuajePage(indexPage: any): string {
    let nombreImagen = this.tatuajeFileList[indexPage].name;
    return nombreImagen;
  }

  deleteTatuajePage(index: any) {
    this.urlsTatuajes.splice(index, 1);
    this.tatuajeFileList.splice(index, 1);
  }

  /**Upload foto manos */
  onFileManoSelected(event) {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {

        let fileUpload = this.verificaTamanioTypeFile(event.target.files[i]);

        if (fileUpload !== null) {
          var reader = new FileReader();
          reader.onload = (event1: any) => {
            console.log(event1.target.result);
            this.urlsManos.push(event1.target.result);
            this.manosFileList.push(event.target.files[i]);
          }
          reader.readAsDataURL(event.target.files[i]);
        }
      }
    }
  }

  verNombreManoPage(indexPage: any): string {
    let nombreImagen = this.manosFileList[indexPage].name;
    return nombreImagen;
  }

  deleteManoPage(index: any) {
    this.urlsManos.splice(index, 1);
    this.manosFileList.splice(index, 1);
  }

  /**Upload DNIA LADO A */
  onFileDNIASelected(event) {
    let file: File = event.target.files[0] as File;
    this.fileDNIA = this.verificaTamanioTypeFile(file);
    this.verDNIA();
  }

  deleteDNIA() {
    this.fileDNIA = null;
    this.previewDNIA = "";
  }

  verDNIA() {
    // Show preview
    var mimeType = this.fileDNIA.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    var reader = new FileReader();
    reader.readAsDataURL(this.fileDNIA);
    reader.onload = (_event) => {
      this.previewDNIA = reader.result;
    }
  }

  /**Upload DNIA LADO B */
  onFileDNIBSelected(event) {
    let file: File = event.target.files[0] as File;
    this.fileDNIB = this.verificaTamanioTypeFile(file);
    this.verDNIB();
  }

  deleteDNIB() {
    this.fileDNIB = null;
    this.previewDNIB = "";
  }

  verDNIB() {
    // Show preview
    var mimeType = this.fileDNIB.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    var reader = new FileReader();
    reader.readAsDataURL(this.fileDNIB);
    reader.onload = (_event) => {
      this.previewDNIB = reader.result;
    }
  }

  /**Upload SEGURO SOCIAL */
  onFileSeguroSocialSelected(event) {
    let file: File = event.target.files[0] as File;
    this.fileSeguroSocial = this.verificaTamanioTypeFile(file);
    this.verSeguroSocial();
  }

  deleteSeguroSocial() {
    this.fileSeguroSocial = null;
    this.previewSeguroSocial = "";
  }

  verSeguroSocial() {
    // Show preview
    var mimeType = this.fileSeguroSocial.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    var reader = new FileReader();
    reader.readAsDataURL(this.fileSeguroSocial);
    reader.onload = (_event) => {
      this.previewSeguroSocial = reader.result;
    }
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

    /*this.authService.finByIdEstilosBile(1)
      .subscribe(resp => {
        this.estilosBaileSelect = resp;
      });*/

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

    /*this.authService.finByIdEstilosCanto(1)
      .subscribe(resp => {
        this.estilosCantoSelect = resp;
      });*/

    //llenado de habilidadess
    this.authService.getAllHabilidades()
      .subscribe(resp => {
        this.habilidadess = resp;
      });

    /*this.authService.finByIdHabilidades(1)
      .subscribe(resp => {
        this.habilidadessSelect = resp;
      });*/

    //llenado de idiomas
    this.authService.getAllIdiomas()
      .subscribe(resp => {
        this.idiomas = resp;
      });

    /*this.authService.finByIdIdiomas(1)
      .subscribe(resp => {
        this.idiomasSelect = resp;
      });*/

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

    /*this.authService.finByIdDeportes(1)
      .subscribe(resp => {
        this.deporteSelect = resp;
      });*/

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

    /*this.authService.finByIdInstrumento(1)
      .subscribe(resp => {
        this.instrumentoSelect = resp;
      });*/
  }

  createRegisterForm() {
    this.actorForm = this.formBuilder.group({

      tattos: [''],


      /****fin variables nuevas */
      email: ['', [Validators.required, Validators.email, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      acceptTerms: [false, Validators.requiredTrue],

      placebirth: [''],

      username: ['', Validators.required],
      nombres: ['', Validators.required],

      nrocuenta: ['', Validators.required],

      apellidos: ['', Validators.required],
      bilingue: [''],
      nombreArtistico: [''],
      sexo: [''],
      telefono: ['', Validators.required],
      fechaNacimiento: [''],
      nacionalidad: [''],
      localidad: [''],
      videoBook: ['', Validators.required],
      provincia: [''],
      codpostal: [''],
      direccion: ['', Validators.required],

      tallaPantalon: ['', Validators.required],
      tallaCamisa: ['', Validators.required],
      tallaChaqueta: ['', Validators.required],
      pie: ['', Validators.required],

      utTeatro: [''],
      utCine: [''],
      utFiccion: [''],
      utPublicidad: [''],

      altura: ['', Validators.required],

      colorPiel: ['', Validators.required],
      colorPelo: ['', Validators.required],
      colorOjos: ['', Validators.required],
      numeroDNI: ['', Validators.required],
      numeroSeguridadSocial: ['', Validators.required],
      carnetConducir: [''],
      modeloCoche: [''],
      colorCoche: [''],
      modeloMoto: [''],
      colorMoto: [''],
      observaciones: [''],

    }

      , {
        validator: MustMatch('password', 'confirmPassword')
      });

  }

  pasarDatosFormUsuario() {
    this.submitted = true;

    const newUserObject = this.actorForm.value;

    this.usuario = {
      idUser: 0,
      avatar: this.urlAvatar,
      fotoCuerpo: this.urlCuerpoEntero,
      fotoProfesional: this.urlArtistico,
      acento: newUserObject.acento,
      altura: newUserObject.altura,
      apellidos: newUserObject.apellidos,
      bilingue: newUserObject.bilingue,
      carnetConducir: newUserObject.carnetConducir,
      tipoCarnetConducir: this.tipoCarnetSelect,
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
      fechaNacimiento: this.date,
      libroFamilia: '',
      libroFamiliarList: [],
      pathDniMadreB: '',
      pathDniPadreB: '',
      pathDniUserB: this.urlUsuarioB,
      localidad: newUserObject.localidad,
      nacionalidad: newUserObject.nacionalidad,
      nombreArtistico: newUserObject.nombreArtistico,
      nombreCompleto: '',
      nombres: newUserObject.nombres,
      nrocuenta: newUserObject.nrocuenta,
      numeroSeguroSocial: newUserObject.numeroSeguridadSocial,
      observaciones: newUserObject.observaciones,
      password: newUserObject.password,
      pathDniMadre: '',
      pathDniPadre: '',
      pathDniUser: this.urlUsuarioA,
      pathDniRepresentante: '',
      pathSeguroSocial: this.urlSeguroSocial,
      provincia: newUserObject.provincia,
      sexo: newUserObject.sexo,
      telefono: newUserObject.telefono,
      telefonoMadre: '',
      telefonoPadre: '',
      lugarNacimiento: newUserObject.placebirth,
      edad: 0,
      actor: 'SI',
      username: newUserObject.username,
      videobook: newUserObject.videoBook,
      instrumentoList: this.instrumentoSelect,
      estilosCantoList: this.estilosCantoSelect,
      deporteList: this.deporteSelect,
      estiloBaileList: this.estilosBaileSelect,
      idiomasList: this.idiomasSelect,
      habilidadesList: this.habilidadessSelect,
      tallasList: [],
      ultimosTrabajosList: [],
      idCantante: this.cantanteSelect,
      idBailarin: this.baileSelect,
      idEtnia: this.etniaSelect,

      idType: {
        idType: 1,
        description: 'ACTOR',
        nombres: 'ACTOR'
      },
      idDeportista: this.deportistaSelect,
      idMusico: this.musicoSelect,
      motoList: [],
      cocheList: [],
      fotosTatuajesList: [],
      fotosManosList: []
    };
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

  guardarUltimosTrabajos(idUser) {
    const newUserObject = this.actorForm.value;
    let ultimosTrabajosList = [{
      idUltimosTrabajos: 0,
      descripcionUltimoTrabajo: newUserObject.utTeatro,
      nombreUltimoTrabajo: newUserObject.utTeatro,
      idUser: idUser
    },
    {
      idUltimosTrabajos: 0,
      descripcionUltimoTrabajo: newUserObject.utCine,
      nombreUltimoTrabajo: newUserObject.utCine,
      idUser: idUser
    },
    {
      idUltimosTrabajos: 0,
      descripcionUltimoTrabajo: newUserObject.utFiccion,
      nombreUltimoTrabajo: newUserObject.utFiccion,
      idUser: idUser
    },
    {
      idUltimosTrabajos: 0,
      descripcionUltimoTrabajo: newUserObject.utPublicidad,
      nombreUltimoTrabajo: newUserObject.utPublicidad,
      idUser: idUser
    }
    ]

    for (let x = 0; x < ultimosTrabajosList.length; x++) {
      this.authService.ul(ultimosTrabajosList[x]).subscribe(
        resTalla => {
          console.log('talla guardada');
        },
        (err) => {
          this.ngxSmartModalService.create('confirm', 'Se ha presentado un Error, vuelva a intentarlo y si el problema persiste, contáctenos').open();
          console.log(JSON.stringify(err));
        });
    }
  }

  onChangeDate($event) {
    let date1 = new Date($event.value);
    this.date = new Date();
    this.date.setDate(date1.getUTCDate());
    this.date.setMonth(date1.getUTCMonth());
    this.date.setFullYear(date1.getUTCFullYear());
  }

  onChangeGenero(mrChange: MatRadioChange) {
    this.actorForm.controls.sexo.setValue(mrChange.value);
  }

  OnChange($event, item, id) {
    console.log($event);
    console.log(item);
    $event.source.focus();

    /**habilidades deporte 1*/
    if (id === 1) {
      if ($event.checked) {
        this.deporteSelect.push(item);
      } else {
        const index: number = this.deporteSelect.indexOf(item);
        this.deporteSelect.splice(index, 1);
      }
    } else if (id === 2) {
      if ($event.checked) {
        this.estilosBaileSelect.push(item);
      } else {
        const index: number = this.estilosBaileSelect.indexOf(item);
        this.estilosBaileSelect.splice(index, 1);
      }
    } else if (id === 3) {
      if ($event.checked) {
        this.instrumentoSelect.push(item);
      } else {
        const index: number = this.instrumentoSelect.indexOf(item);
        this.instrumentoSelect.splice(index, 1);
      }
    } else if (id === 4) {
      if ($event.checked) {
        this.estilosCantoSelect.push(item);
      } else {
        const index: number = this.estilosCantoSelect.indexOf(item);
        this.estilosCantoSelect.splice(index, 1);
      }
    } else if (id === 5) {
      if ($event.checked) {
        this.habilidadessSelect.push(item);
      } else {
        const index: number = this.habilidadessSelect.indexOf(item);
        this.habilidadessSelect.splice(index, 1);
      }
    } else if (id === 6) {
      if ($event.checked) {
        this.idiomasSelect.push(item);
      } else {
        const index: number = this.idiomasSelect.indexOf(item);
        this.idiomasSelect.splice(index, 1);
      }
    }

    //MatCheckboxChange {checked,MatCheckbox}
  }


  /**REGISTRAR FOTOS */
  registrarFotos(idUser) {

    var filesAmount = this.listMotos.length;
    for (let i = 0; i < filesAmount; i++) {
      let moto = {
        colorMoto: this.listMotos[i].colorMoto,
        fotoMoto: this.listMotos[i].fotoMoto,
        modeloMoto: this.listMotos[i].modeloMoto,
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

    filesAmount = this.listCoches.length;
    for (let i = 0; i < filesAmount; i++) {
      let coche = {
        colorCoche: this.listCoches[i].colorCoche,
        fotoCoche: this.listCoches[i].fotoCoche,
        modeloCoche: this.listCoches[i].modeloCoche,
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

    filesAmount = this.tatuajeFileList.length;
    for (let i = 0; i < filesAmount; i++) {
      let urlTatuajes = 'actor/' + idUser + '/tatuajes-' + this.tatuajeFileList[i].name;

      let fotosTatuajes = {
        fechaCargaTatuaje: new Date(),
        nombreFotoTatuaje: 'tatuaje' + idUser,
        urlFotoTatuaje: urlTatuajes,
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
    filesAmount = this.manosFileList.length;
    for (let i = 0; i < filesAmount; i++) {
      let urlManos = 'actor/' + idUser + '/manos-' + this.manosFileList[i].name;

      let fotosManos = {
        fechaCargaMano: new Date(),
        nombreFotoMano: 'manos' + idUser,
        urlFotoMano: urlManos,
        idUser: idUser
      };

      /***GUARDE CON SERVICIO */
      this.authService.saveManos(fotosManos).subscribe(
        resTalla => {
          console.log('info save fotosManos');
        },
        (err) => {
          console.log('error save fotosManos' + err);
        });
    }
  }
  /**REGISTRAR FOTOS */

  /**ENVIA CONFIRMACION DE EMAIL */
  enviarEmailRegistro() {
    const email: Email = {
      usernameTo: this.usuario.username,
      emailTo: this.usuario.email,
      telefonoTo: this.usuario.telefono,
      mensajeTo: 'Gracias por registrarte en Ninesselas, pronto nos contactaremos contigo.',
    };
    this.emailService.notificarRegistro(email)
      .subscribe(
        res => {
          //alert('Correo Enviado! Gracias por contactarnos, en breve nos comunicaremos contigo!');
        },
        err => console.log(err),
        () => {
          //alert('Ups, inconvenientes en envío de email!');
        }
      );
  }
  /**ENVIA CONFIRMACION DE EMAIL */


  /**REGISTRO DE ACTOR */
  registrarActor() {
    this.submitted = true;
    if (this.actorForm.invalid || this.actorForm.get('acceptTerms').value === false) {
      this.ngxSmartModalService.create('failform', 'Por favor, ingresar los datos del formulario requeridos').open();
      return;
    }

    if (this.fileAvatar === null || this.fileCuerpoEntero === null || this.fileArtistico === null) {
      this.ngxSmartModalService.create('nopics', 'Por favor, cargar las 3 primeras fotos: perfil, cuerpo entero y artístico').open();
      return;
    }
    this.subirArchivos();
    this.pasarDatosFormUsuario();
    this.authService.signup2(this.usuario).subscribe(
      res => {


        if (res.nombreArtistico !== 'ENCONTRADO') {
          this.registrarFotos(res.idUser);
          this.guardarTalla(res.idUser);
          this.enviarEmailRegistro();
          localStorage.setItem('token', res.idUser);

          this.router.navigate(['/homeuser']);
          this.ngxSmartModalService.create('confirm', 'Se ha registrado exitosamente' + this.usuario.nombreCompleto).open();
        } else { this.ngxSmartModalService.create('userexist', 'El usuario con email: ' + this.usuario.email + ' YA EXISTE.!').open(); }

      },
      (err) => {
        this.ngxSmartModalService.create('error', 'Se ha presentado un Error, vuelva a intentarlo y si el problema persiste, contáctenos').open();
        console.log(JSON.stringify(err));
      });
  }
  /**REGISTRO DE ACTOR */


  /**SUBIR ARCHIVOS A FIREBASE */
  subirArchivos() {
    /**subir avatar */
    let idUser = this.actorForm.get('numeroDNI').value;
    let task;
    if (this.fileAvatar != null) {
      this.urlAvatar = 'actor/' + idUser + '/avatar-' + this.fileAvatar.name;
      task = this.storage.upload(this.urlAvatar, this.fileAvatar);
    }

    /**subir cuerpo entero */
    if (this.fileCuerpoEntero != null) {
      this.urlCuerpoEntero = 'actor/' + idUser + '/cuerpo-' + this.fileCuerpoEntero.name;
      task = this.storage.upload(this.urlCuerpoEntero, this.fileCuerpoEntero);
    }
    if (this.fileArtistico != null) {
      /**subir foto artistica */
      this.urlArtistico = 'actor/' + idUser + '/artistico-' + this.fileArtistico.name;
      task = this.storage.upload(this.urlArtistico, this.fileArtistico);
    }

    if (this.fileDNIA != null) {
      /**subir dni lado frontal */
      this.urlUsuarioA = 'actor/' + idUser + '/dnia-' + this.fileDNIA.name;
      task = this.storage.upload(this.urlUsuarioA, this.fileDNIA);
    }

    if (this.fileDNIB != null) {
      /**subir dni lado frontal */
      this.urlUsuarioB = 'actor/' + idUser + '/dnia-' + this.fileDNIB.name;
      task = this.storage.upload(this.urlUsuarioB, this.fileDNIB);
    }

    if (this.fileSeguroSocial != null) {
      /**subir dni lado frontal */
      this.urlSeguroSocial = 'actor/' + idUser + '/dnia-' + this.fileSeguroSocial.name;
      task = this.storage.upload(this.urlSeguroSocial, this.fileSeguroSocial);
    }

    if (this.cochesFileList != null) {
      /**subir coche */
      var filesAmount = this.cochesFileList.length;
      for (let i = 0; i < filesAmount; i++) {
        let urlCoche = 'actor/' + idUser + '/coche-' + this.cochesFileList[i].name;
        task = this.storage.upload(urlCoche, this.cochesFileList[i]);
      }
    }
    if (this.motosFileList != null) {
      /**subir moto */
      var filesAmount = this.motosFileList.length;
      for (let i = 0; i < filesAmount; i++) {
        let urlMoto = 'actor/' + idUser + '/moto-' + this.motosFileList[i].name;
        task = this.storage.upload(urlMoto, this.motosFileList[i]);
      }
    }
    if (this.tatuajeFileList != null) {
      /**subir tatuajes */
      var filesAmount = this.tatuajeFileList.length;
      for (let i = 0; i < filesAmount; i++) {
        let urlTatuajes = 'actor/' + idUser + '/tatuajes-' + this.tatuajeFileList[i].name;
        task = this.storage.upload(urlTatuajes, this.tatuajeFileList[i]);
      }
    }
    if (this.manosFileList != null) {
      /**subir manos */
      var filesAmount = this.manosFileList.length;
      for (let i = 0; i < filesAmount; i++) {
        let urlManos = 'actor/' + idUser + '/manos-' + this.manosFileList[i].name;
        task = this.storage.upload(urlManos, this.manosFileList[i]);
      }
    }
  }
  /**SUBIR ARCHIVOS A FIREBASE */


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
