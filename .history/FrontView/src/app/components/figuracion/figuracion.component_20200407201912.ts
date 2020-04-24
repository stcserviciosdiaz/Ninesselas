import { moto } from './../../models/moto';
import { tipoUsuario } from './../../models/tipoUsuario';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { Usuario } from './../../models/usuario';
import { Component, Input, OnDestroy, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { AuthService } from '../../Services/auth.service';
import { Router } from '@angular/router';
import { ErrorStateMatcher, MatRadioChange } from '@angular/material';
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
import { deportista } from 'src/app/models/deportista';
import { deportes } from 'src/app/models/deportes';
import { EmailService } from 'src/app/Services/email.service';
import { Email } from 'src/app/models/email';
import { musico } from 'src/app/models/musico';
import { instrumento } from 'src/app/models/instrumentos';
import { SeoService } from 'src/app/Services/seo.service';
import { Title } from '@angular/platform-browser';
import { coche } from 'src/app/models/coche';

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
    private title: Title,
    private seo: SeoService,
    private storage: AngularFireStorage,
    private authService: AuthService,
    private emailService: EmailService,
    public ngxSmartModalService: NgxSmartModalService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {

  }

  hide = true;
  LinktattoSelect;
  WorkingSelect;

  tamanioFotos = 4;//MB
  date;


  /***variables para carga de imagenes y archivos */
  fileAvatar: File = null;
  fileCoche: File = null;
  fileMoto: File = null;
  fileTatuajes: File = null;
  fileManos: File = null;
  fileCuerpoEntero: File = null;
  /* fileArtistico: File = null; */
  fileDNIA: File = null;
  fileDNIB: File = null;
  fileSeguroSocial: File = null;

  urlsTatuajes = [];
  urlsManos = [];
  urlsCoches = [];
  urlsMotos = [];

  tatuajeFileList: File[] = [];
  manosFileList: File[] = [];
  cochesFileList: File[] = [];
  motosFileList: File[] = [];

  listCoches: coche[] = [];
  listCoche: { coche: coche, url: string, file: File }[] = [];


  /***PREVIEW FOTOS */
  previewAvatar: any = null;
  previewCuerpo: any = null;
  previewDNIA: any = null;
  previewDNIB: any = null;
  previewSeguroSocial: any = null;

  urlAvatar: string;
  urlMoto: string;
  urlCoche: string;
  urlTatuajes: string;
  urlManos: string;
  urlCuerpoEntero: string;
  /*  urlArtistico: string; */
  urlUsuarioA: string;
  urlUsuarioB: string;
  urlSeguroSocial: string;



  /*******variables para combos********/
  etnias: etnia[] = [];
  baile: bailarin[] = [];
  estilosBaile: estilosBaile[] = [];
  cantante: cantante[] = [];
  estilosCanto: estilosCanto[] = [];
  habilidadess: habilidades[] = [];
  idiomas: idiomas[] = [];
  deportista: deportista[] = [];
  deportes: deportes[] = [];
  listDeportes: deportes[] = [];
  typecarnet: string[] = ['Tipo A', 'Tipo B', 'Tipo C', 'Tipo D', 'Tipo BTP'];
  tattos: string[] = ['Si', 'No'];
  Models: string[] = ['Si', 'No'];
  //selected
  actorSelect;
  tipoCarnetSelect;
  musico;
  instrumentoss;
  musicoSelect: musico = new musico();
  instrumentoSelect: instrumento[] = [];
  usuario: Usuario = new Usuario();
  etniaSelect: etnia = new etnia();
  baileSelect: bailarin = new bailarin();
  estilosBaileSelect: estilosBaile[] = [];
  cantanteSelect: cantante = new cantante();
  estilosCantoSelect: estilosCanto[] = [];
  habilidadessSelect: habilidades[] = [];
  idiomasSelect: idiomas[] = [];
  deportistaSelect: deportista = new deportista();
  deporteSelect: deportes[] = [];
  /*****fin variables combos*****/
  actorForm: FormGroup;
  submitted = false;

  /**Inicializacion */
  ngOnInit() {
    let t: string = "Ninesselas - Figuración";
    this.title.setTitle(t);

    this.seo.generateTags({
      title: "Ninesselas - Figuración",
      description: "Nines Selas Agency",
      slug: "figuracion"
    });

    this.createRegisterForm();
    this.llenarCombos();

    this.deporteSelect = [];
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

    /* this.authService.finByIdEstilosBile(1)
       .subscribe(resp => {
         this.estilosBaileSelect = resp;
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


    /* this.authService.finByIdIdiomas(1)
       .subscribe(resp => {
         this.idiomasSelect = resp;
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

  }

  /**Construccion de form match variables y campos */
  createRegisterForm() {
    this.actorForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      confirmPassword: ['', Validators.required],
      username: ['', Validators.required],
      acceptTerms: [false, Validators.required],

      placebirth: [''],
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      bilingue: [''],
      localidad: [''],
      provincia: [''],
      nrocuenta: ['', Validators.required],

      codpostal: [''],
      direccion: ['', Validators.required],
      sexo: [''],
      telefono: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      nacionalidad: [''],
      acento: [''],
      tallaPantalon: ['', Validators.required],
      tallaCamisa: ['', Validators.required],
      tallaChaqueta: ['', Validators.required],
      pie: ['', Validators.required],
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
      typecarnet: [''],
      observaciones: [''],
    }
      , {
        validator: MustMatch('password', 'confirmPassword')
      });

  }

  onChangeGenero(mrChange: MatRadioChange) {
    this.actorForm.controls.sexo.setValue(mrChange.value);
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

  onChangeDate($event) {
    let date1 = new Date($event.value);
    this.date = new Date();
    this.date.setDate(date1.getUTCDate());
    this.date.setMonth(date1.getUTCMonth());
    this.date.setFullYear(date1.getUTCFullYear());
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


  /**Upload foto moto */
  onFileMotoSelected(event) {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {

        let fileUpload = this.verificaTamanioTypeFile(event.target.files[i]);

        if (fileUpload !== null) {
          var reader = new FileReader();
          reader.onload = (event1: any) => {
            this.urlsMotos.push(event1.target.result);
            this.motosFileList.push(event.target.files[i]);
          }
          reader.readAsDataURL(event.target.files[i]);
        }
      }
    }
  }

  verNombreMotoPage(indexPage: any): string {
    let nombreImagen = this.motosFileList[indexPage].name;
    return nombreImagen;
  }

  deleteMotoPage(index: any) {
    this.urlsMotos.splice(index, 1);
    this.motosFileList.splice(index, 1);
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
            this.listCoche.push(null, null, event1.target.result);
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
    if (!this.listCoches.indexOf(index)) {
      this.listCoches.splice(index, 1);
    }
  }



  aceptarCoche(indexCocheFile: any) {
    const object = this.actorForm.value;
    let idUser = this.actorForm.get('numeroDNI').value;
    this.urlCoche = 'figuracion/' + idUser + '/coche-' + this.cochesFileList[indexCocheFile].name;
    let coche = {
      idCoche: 0,
      colorCoche: object.colorCoche,
      fotoCoche: this.urlCoche,
      modeloCoche: object.modeloCoche,
    };

    if (!this.listCoches.indexOf(indexCocheFile)) {
      this.listCoches.push(coche);
      this.listCoche[indexCocheFile].coche = coche;
      this.listCoche[indexCocheFile].url = this.urlCoche;
    } else { this.listCoches[indexCocheFile] = coche; }
    console.log('DATOS COCHE ARRAY: ' + this.listCoche.length);
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
  pasarDatosFormUsuario() {
    this.submitted = true;
    const newUserObject = this.actorForm.value;

    this.usuario = {
      idUser: 0,
      avatar: this.urlAvatar,
      fotoCuerpo: this.urlCuerpoEntero,
      fotoProfesional: "",
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
      nombreArtistico: '',
      nombreCompleto: '',
      nombres: newUserObject.nombres,
      nrocuenta: newUserObject.nrocuenta,
      numeroSeguroSocial: newUserObject.numeroSeguridadSocial,
      observaciones: '',
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
      actor: '',
      username: newUserObject.username,
      videobook: '',
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
        idType: 2,
        description: 'FIGURACION',
        nombres: 'FIGURACION'
      },
      idDeportista: this.deportistaSelect,
      idMusico: this.musicoSelect,
      motoList: [],
      cocheList: [],
      fotosTatuajesList: [],
      fotosManosList: []
    };
  }


  OnChange($event, item, id) {
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

  registrarFotos(idUser) {

    var filesAmount = this.motosFileList.length;
    for (let i = 0; i < filesAmount; i++) {
      this.urlMoto = 'figuracion/' + idUser + '/moto-' + this.motosFileList[i].name;
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
          console.log('error save fotosManos' + err);
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
      });
  }

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
          // alert('Ups, inconvenientes en envío de email!');
        }
      );
  }

  registrarActor() {
    this.submitted = true;

    console.log('DATOS ANTES DE GUARDAR: ' + JSON.stringify(this.actorForm.value));


    if (this.actorForm.invalid || this.actorForm.get('acceptTerms').value === false) {
      this.ngxSmartModalService.create('failform', 'Por favor, ingresar los datos del formulario requeridos').open();
      return;
    }

    if (this.fileAvatar === null || this.fileCuerpoEntero === null || this.fileManos === null) {
      this.ngxSmartModalService.create('nopics', 'Por favor, cargar fotos: perfil, cuerpo entero y manos').open();
      return;
    }
    this.subirArchivos();
    this.pasarDatosFormUsuario();
    this.authService.signup2(this.usuario).subscribe(
      res => {
        if (res.nombreArtistico !== 'ENCONTRADO') {
          localStorage.setItem('token', res.idUser);
          this.ngxSmartModalService.create('confirm', 'Cuenta de Figuración creada exitosamente ' + res.nombres + ' ' + res.apellidos).open();
          this.registrarFotos(res.idUser);
          this.guardarTalla(res.idUser);
          this.enviarEmailRegistro();
          this.router.navigate(['/homeuser']);
        } else { this.ngxSmartModalService.create('userexist', 'El usuario con email: ' + this.usuario.email + ' YA EXISTE.!').open(); }
      },
      (err) => {
        this.ngxSmartModalService.create('error', 'Se ha presentado un Error, vuelva a intentarlo y si el problema persiste, contáctenos').open();
      });
  }

  subirArchivos() {
    /**subir avatar */
    let idUser = this.actorForm.get('numeroDNI').value;
    let task;

    if (this.fileAvatar != null) {
      this.urlAvatar = 'figuracion/' + idUser + '/avatar-' + this.fileAvatar.name;
      task = this.storage.upload(this.urlAvatar, this.fileAvatar);
    }
    if (this.fileCuerpoEntero != null) {
      /**subir cuerpo entero */
      this.urlCuerpoEntero = 'figuracion/' + idUser + '/cuerpo-' + this.fileCuerpoEntero.name;
      task = this.storage.upload(this.urlCuerpoEntero, this.fileCuerpoEntero);
    }
    /**subir foto artistica */
    /*  this.urlArtistico = 'figuracion/' + idUser + '/artistico-' + this.fileArtistico.name;
     task = this.storage.upload(this.urlArtistico, this.fileArtistico); */

    if (this.cochesFileList != null) {
      /**subir coche */
      var filesAmount = this.cochesFileList.length;
      for (let i = 0; i < filesAmount; i++) {
        this.urlCoche = 'figuracion/' + idUser + '/coche-' + this.cochesFileList[i].name;
        task = this.storage.upload(this.urlCoche, this.cochesFileList[i]);
      }
    }
    if (this.motosFileList != null) {
      /**subir moto */
      var filesAmount = this.motosFileList.length;
      for (let i = 0; i < filesAmount; i++) {
        this.urlMoto = 'figuracion/' + idUser + '/moto-' + this.motosFileList[i].name;
        task = this.storage.upload(this.urlMoto, this.motosFileList[i]);
      }
    }
    if (this.tatuajeFileList != null) {
      /**subir tatuajes */
      var filesAmount = this.tatuajeFileList.length;
      for (let i = 0; i < filesAmount; i++) {
        this.urlTatuajes = 'figuracion/' + idUser + '/tatuajes-' + this.tatuajeFileList[i].name;
        task = this.storage.upload(this.urlTatuajes, this.tatuajeFileList[i]);
      }
    }
    if (this.manosFileList != null) {
      /**subir manos */
      var filesAmount = this.manosFileList.length;
      for (let i = 0; i < filesAmount; i++) {
        this.urlManos = 'figuracion/' + idUser + '/manos-' + this.manosFileList[i].name;
        task = this.storage.upload(this.urlManos, this.manosFileList[i]);
      }
    }
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
