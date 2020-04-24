import { Usuario } from './../../models/usuario';
import { tallas } from './../../models/tallas';
import { Component, Input, OnDestroy, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { NgxSmartModalService, NgxSmartModalComponent } from 'ngx-smart-modal';
import { AuthService } from '../../Services/auth.service';
import { Router } from '@angular/router';
import { ErrorStateMatcher, MatRadioChange } from '@angular/material';
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
import { Email } from 'src/app/models/email';
import { EmailService } from 'src/app/Services/email.service';
import { SeoService } from 'src/app/Services/seo.service';
import { Title } from '@angular/platform-browser';
import { libroFamiliar } from 'src/app/models/libroFamiliar';


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
  hide = true;
  LinktattoSelect;
  WorkingSelect


  isavailable = false;
  tamanioFotos = 4;//MB
  date;

  avatarFile: File = null;
  copyDNIFather: File = null;
  CopyDNIMother: File = null;
  familyBookFile: File = null;
  copySocialNumber: File = null;
  copyDNIkid: File = null;

  fileData: File = null;
  previewAvatar: any = null;
  previewCuerpo: any = null;
  previewArtistico: any = null;

  /****DNI USER */
  //FILES A/B
  fileDNIUserA: File = null;
  fileDNIUSerB: File = null;

  //PREVIEW
  previewDNIA: any = null;
  previewDNIB: any = null;

  /****DNI USER PADRE */
  //FILES A/B
  fileDNIPadreA: File = null;
  fileDNIPadreB: File = null;
  //PREVIEW
  previewDNIPadreA: any = null;
  previewDNIPadreB: any = null;

  /****DNI USER MADRE */
  //FILES A/B
  fileDNIMadreA: File = null;
  fileDNIMadreB: File = null;
  //PREVIEW
  previewDNIMadreA: any = null;
  previewDNIMadreB: any = null;

  /***SEGURO SOCIAL */
  //PREVIEW
  previewSS: any = null;


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
  urlUsuarioB: string;
  urlSegurosocial: string;
  urlPadre: string;
  urlMadre: string;
  urlPadreB: string;
  urlMadreB: string;
  urlLibroFamilia: string;
  urlRepresentante: string;
  urlCuerpoEntero: string;
  urlArtistico: string;

  /*******variables para combos********/
  edad = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
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
  musicoSelect: musico = new musico();
  instrumentoSelect: instrumento[] = [];
  libroFamiliarList: libroFamiliar[] = [];
  /*****fin variables combos*****/

  @ViewChild(TemplateRef, { static: false }) tpl: TemplateRef<any>;

  constructor(
    private title: Title,
    private seo: SeoService,
    private storage: AngularFireStorage,
    private http: HttpClient,
    private authService: AuthService,
    private emailService: EmailService,
    public ngxSmartModalService: NgxSmartModalService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {

  }

  ngOnInit() {
    let t: string = "Ninesselas - Niños";
    this.title.setTitle(t);

    this.seo.generateTags({
      title: "Ninesselas - Niños",
      description: "Nines Selas Agency",
      slug: "niños"
    });

    this.llenarCombos();
    this.childForm = this.formBuilder.group({
      username: ['', Validators.required],
      nombres: ['', Validators.required],
      nrocuenta: ['', Validators.required],
      acceptTerms: [false, Validators.requiredTrue],
      apellidos: ['', Validators.required],
      bilingue: [''],
      email: ['', [Validators.required, Validators.email, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      sexo: [''],
      videoBook: ['', Validators.required],
      actor: [''],

      placebirth: [''],

      edad: [''],
      codpostal: [''],

      telefono: ['', [Validators.required, Validators.minLength(6)]],
      telefonofather: ['', [Validators.required, Validators.minLength(6)]],
      telefonomother: ['', [Validators.required, Validators.minLength(6)]],
      fechaNacimiento: ['', Validators.required],
      nacionalidad: [''],
      tallaPantalon: ['', Validators.required],
      tallaCamisa: ['', Validators.required],
      tallaChaqueta: ['', Validators.required],
      localidad: [''],
      provincia: [''],
      direccion: ['', Validators.required],
      pie: ['', Validators.required],
      altura: ['', Validators.required],
      colorPiel: ['', Validators.required],
      colorPelo: ['', Validators.required],
      colorOjos: ['', Validators.required],
      observaciones: [''],
      numeroDNI: ['', Validators.required],
      numeroSeguridadSocial: ['', Validators.required],
      numeroDNIPadre: [''],
      numeroDNIMadre: [''],
      numeroDNIRepresentante: [''],

      utTeatro: [''],
      utCine: [''],
      utFiccion: [''],
      utPublicidad: [''],

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
    this.usuario = {
      idUser: 0,
      avatar: this.urlAvatar,
      fotoCuerpo: this.urlCuerpoEntero,
      fotoProfesional: this.urlArtistico,
      acento: newChild.acento,
      altura: newChild.altura,
      apellidos: newChild.apellidos,
      bilingue: newChild.bilingue,
      carnetConducir: '',
      tipoCarnetConducir: '',
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
      fechaNacimiento: this.date,
      libroFamilia: this.urlLibroFamilia,
      libroFamiliarList: this.libroFamiliarList,
      localidad: newChild.localidad,
      nacionalidad: newChild.nacionalidad,
      nombreArtistico: newChild.nombreArtistico,
      nombreCompleto: '',
      nombres: newChild.nombres,
      nrocuenta: newChild.nrocuenta,
      numeroSeguroSocial: newChild.numeroSeguridadSocial,
      observaciones: newChild.observaciones,
      password: newChild.password,
      pathDniMadre: this.urlMadre,
      pathDniPadre: this.urlPadre,
      pathDniUser: this.urlUsuario,
      pathDniMadreB: this.urlMadreB,
      pathDniPadreB: this.urlPadreB,
      pathDniUserB: this.urlUsuarioB,
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
      instrumentoList: this.instrumentoSelect,
      estilosCantoList: this.estilosCantoSelect,
      deporteList: this.deporteSelect,
      estiloBaileList: this.estilosBaileSelect,
      idiomasList: this.idiomasSelect,
      habilidadesList: this.habilidadessSelect,
      tallasList: [],
      ultimosTrabajosList: [
        {
          idUltimosTrabajos: 0,
          descripcionUltimoTrabajo: newChild.utTeatro,
          nombreUltimoTrabajo: newChild.utTeatro,
        },
        {
          idUltimosTrabajos: 0,
          descripcionUltimoTrabajo: newChild.utCine,
          nombreUltimoTrabajo: newChild.utCine,
        },
        {
          idUltimosTrabajos: 0,
          descripcionUltimoTrabajo: newChild.utFiccion,
          nombreUltimoTrabajo: newChild.utFiccion,
        },
        {
          idUltimosTrabajos: 0,
          descripcionUltimoTrabajo: newChild.utPublicidad,
          nombreUltimoTrabajo: newChild.utPublicidad,
        }
      ],
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

  signupChild() {

    this.submitted = true;


    if (this.childForm.invalid || this.childForm.get('acceptTerms').value === false) {
      this.ngxSmartModalService.create('failform', 'Por favor, ingresar los datos del formulario requeridos').open();
      return;
    }

    if (this.avatarFile === null || this.fileCuerpoEntero === null || this.fileArtistico === null) {
      this.ngxSmartModalService.create('nopics', 'Por favor, cargar las 3 primeras fotos: perfil, cuerpo entero y artístico.').open();
      return;
    }

    if (this.copyDNIkid === null || this.fileDNIUSerB === null) {
      this.ngxSmartModalService.create('nodniuser', 'Por favor, cargar fotos del DNI del Niño.').open();
      return;
    }

    if (this.copyDNIFather === null || this.fileDNIPadreB === null) {
      this.ngxSmartModalService.create('nodnipadre', 'Por favor, cargar fotos del DNI del Padre.').open();
      return;
    }


    if (this.CopyDNIMother === null || this.fileDNIMadreB === null) {
      this.ngxSmartModalService.create('nodnimadre', 'Por favor, cargar fotos del DNI de la Madre.').open();
      return;
    }

    if (this.copySocialNumber === null) {
      this.ngxSmartModalService.create('noss', 'Por favor, cargar foto de Seguridad Social del Niño.').open();
      return;
    }

    this.subirArchivos();
    this.pasarDatosFormUsuario();
    this.authService.signup2(this.usuario).subscribe(
      res => {
        if (res.nombreArtistico !== 'ENCONTRADO') {
          localStorage.setItem('token', res.idUser);
          this.ngxSmartModalService.create('confirm', 'Cuenta de Niño creada exitosamente ' + res.nombres + ' ' + res.apellidos).open();
          this.guardarTalla(res.idUser);
          this.enviarEmailRegistro();
          localStorage.setItem('token', res.idUser);
          this.router.navigate(['/homeuser']);
        } else { this.ngxSmartModalService.create('userexist', 'El usuario con email: ' + this.usuario.email + ' YA EXISTE.!').open(); }

      },
      (err) => {
        this.ngxSmartModalService.create('confirm', 'Se ha presentado un Error, vuelva a intentarlo y si el problema persiste, contáctenos').open();
        console.log(JSON.stringify(err));
      });
  }

  onChangeDate($event) {
    let date1 = new Date($event.value);
    this.date = new Date();
    this.date.setDate(date1.getUTCDate());
    this.date.setMonth(date1.getUTCMonth());
    this.date.setFullYear(date1.getUTCFullYear());
  }

  onChangeGenero(mrChange: MatRadioChange) {
    console.log(mrChange.value);
    this.childForm.controls.sexo.setValue(mrChange.value);
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

  onAvatarSelected(event) {
    let file = event.target.files[0] as File;
    this.avatarFile = this.verificaTamanioTypeFile(file);

    this.verAvatar();
  }

  /**Upload foto cuerpo entero */
  onFileCuerpoEnteroSelected(event) {
    let file = event.target.files[0] as File;
    this.fileCuerpoEntero = this.verificaTamanioTypeFile(file);

    this.verCuerpo();
  }

  /**Upload foto artistica */
  onFileArtisticoSelected(event) {
    let file = event.target.files[0] as File;
    this.fileArtistico = this.verificaTamanioTypeFile(file);

    this.verArtista();
  }


  deleteAvatar() {
    this.avatarFile = null;
    this.previewAvatar = "";
  }


  deleteCuerpo() {
    this.fileCuerpoEntero = null;
    this.previewCuerpo = "";
  }


  deleteArtistico() {
    this.fileArtistico = null;
    this.previewArtistico = "";
  }

  verAvatar() {
    // Show preview
    this.fileData = this.avatarFile;



    var mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    var reader = new FileReader();
    reader.readAsDataURL(this.fileData);
    reader.onload = (_event) => {


      this.previewAvatar = reader.result;


    }
  }

  verCuerpo() {
    // Show preview

    this.fileData = this.fileCuerpoEntero;



    var mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    var reader = new FileReader();
    reader.readAsDataURL(this.fileData);
    reader.onload = (_event) => {


      this.previewCuerpo = reader.result;


    }
  }

  verArtista() {
    // Show preview

    this.fileData = this.fileArtistico;


    var mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    var reader = new FileReader();
    reader.readAsDataURL(this.fileData);
    reader.onload = (_event) => {


      this.previewArtistico = reader.result;

    }
  }

  subirArchivos() {
    /**subir avatar */
    let idUser = this.childForm.get('numeroDNI').value;
    let task;

    if (this.avatarFile != null) {
      this.urlAvatar = 'ninios/' + idUser + '/avatar-' + this.avatarFile.name;
      task = this.storage.upload(this.urlAvatar, this.avatarFile);
    }
    if (this.fileCuerpoEntero != null) {
      /**subir cuerpo entero */
      this.urlCuerpoEntero = 'ninios/' + idUser + '/cuerpo-' + this.fileCuerpoEntero.name;
      task = this.storage.upload(this.urlCuerpoEntero, this.fileCuerpoEntero);
    }
    if (this.fileArtistico != null) {
      /**subir foto artistica */
      this.urlArtistico = 'ninios/' + idUser + '/artistico-' + this.fileArtistico.name;
      task = this.storage.upload(this.urlArtistico, this.fileArtistico);
    }
    if (this.copyDNIFather != null) {
      /**subir dnipadre */
      this.urlPadre = 'ninios/' + idUser + '/dnipadre-' + this.copyDNIFather.name;
      task = this.storage.upload(this.urlPadre, this.copyDNIFather);
    }
    if (this.copyDNIFather != null) {
      /**subir dnipadre */
      this.urlPadreB = 'ninios/' + idUser + '/dnipadreb-' + this.fileDNIPadreB.name;
      task = this.storage.upload(this.urlPadre, this.fileDNIPadreB);
    }
    if (this.CopyDNIMother != null) {
      /**subir dnimadre */
      this.urlMadre = 'ninios/' + idUser + '/dnimadre-' + this.CopyDNIMother.name;
      task = this.storage.upload(this.urlMadre, this.CopyDNIMother);
    }
    if (this.CopyDNIMother != null) {
      /**subir dnimadre */
      this.urlMadreB = 'ninios/' + idUser + '/dnimadreb-' + this.fileDNIMadreB.name;
      task = this.storage.upload(this.urlMadre, this.fileDNIMadreB);
    }
    if (this.familyBookFile != null) {
      /**subir family book  */
      this.urlLibroFamilia = 'ninios/' + idUser + '/librofamiliar-' + this.familyBookFile.name;
      task = this.storage.upload(this.urlLibroFamilia, this.familyBookFile);
    }

    if (this.familyBookFiles.length > 0) {
      var filesAmount = this.familyBookFiles.length;
      for (let i = 0; i < filesAmount; i++) {
        this.urlLibroFamilia = 'ninios/' + idUser + '/librofamiliar-' + this.familyBookFiles[i].name;
        task = this.storage.upload(this.urlLibroFamilia, this.familyBookFiles[i]);
        this.libroFamiliarList.push({
          idLibro: 0,
          fechaCargaLibro: new Date(),
          nombreFotoLibro: this.familyBookFiles[i].name,
          urlFotoLibro: this.urlLibroFamilia,
        });
      }
    }

    if (this.copySocialNumber != null) {
      /**subir numero de seguro social  */
      this.urlSegurosocial = 'ninios/' + idUser + '/segurosocial-' + this.copySocialNumber.name;
      task = this.storage.upload(this.urlSegurosocial, this.copySocialNumber);
    }
    if (this.copyDNIkid != null) {
      /**subir dni user  */
      this.urlUsuario = 'ninios/' + idUser + '/dniuser-' + this.copyDNIkid.name;
      task = this.storage.upload(this.urlUsuario, this.copyDNIkid);
    }
    if (this.fileDNIUSerB != null) {
      /**subir dni user  */
      this.urlUsuarioB = 'ninios/' + idUser + '/dniuserb-' + this.fileDNIUSerB.name;
      task = this.storage.upload(this.urlUsuarioB, this.fileDNIUSerB);
    }
  }

  copyDNIFatherSelected(event) {
    let file = event.target.files[0] as File;
    this.copyDNIFather = this.verificaTamanioTypeFile(file);

    this.verDNIPadreA();
  }

  deleteDNIPadreA() {
    this.copyDNIFather = null;
    this.previewDNIPadreA = "";
  }

  verDNIPadreA() {
    // Show preview
    this.fileData = this.copyDNIFather;
    var mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    var reader = new FileReader();
    reader.readAsDataURL(this.fileData);
    reader.onload = (_event) => {
      this.previewDNIPadreA = reader.result;
    }
  }

  copyDNIPadreB(event) {
    let file = event.target.files[0] as File;
    this.fileDNIPadreB = this.verificaTamanioTypeFile(file);
    this.verDNIPadreB();
  }

  deleteDNIPadreB() {
    this.fileDNIPadreB = null;
    this.previewDNIPadreB = "";
  }

  verDNIPadreB() {
    // Show preview
    this.fileData = this.fileDNIPadreB;
    var mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    var reader = new FileReader();
    reader.readAsDataURL(this.fileData);
    reader.onload = (_event) => {
      this.previewDNIPadreB = reader.result;
    }
  }

  copyDNIMotherSelected(event) {
    let file = event.target.files[0] as File;
    this.CopyDNIMother = this.verificaTamanioTypeFile(file);

    this.verDNIMadreA();
  }

  deleteDNIMadreA() {
    this.CopyDNIMother = null;
    this.previewDNIMadreA = "";
  }

  verDNIMadreA() {
    // Show preview
    this.fileData = this.CopyDNIMother;
    var mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    var reader = new FileReader();
    reader.readAsDataURL(this.fileData);
    reader.onload = (_event) => {
      this.previewDNIMadreA = reader.result;
    }
  }

  copyDNIMadreB(event) {
    let file = event.target.files[0] as File;
    this.fileDNIMadreB = this.verificaTamanioTypeFile(file);
    this.verDNIMadreB();
  }

  deleteDNIMadreB() {
    this.fileDNIMadreB = null;
    this.previewDNIMadreB = "";
  }

  verDNIMadreB() {
    // Show preview
    this.fileData = this.fileDNIMadreB;
    var mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    var reader = new FileReader();
    reader.readAsDataURL(this.fileData);
    reader.onload = (_event) => {
      this.previewDNIMadreB = reader.result;
    }
  }

  /*onFamilyBookSelected(event) {
    let file = event.target.files[0] as File;
    this.familyBookFile = this.verificaTamanioTypeFile(file);
  }*/

  urls = [];
  familyBookFiles: File[] = [];
  onFamilyBookSelected(event) {

    let file = event.target.files[0] as File;
    this.familyBookFile = this.verificaTamanioTypeFile(file);

    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {

        let fileUpload = this.verificaTamanioTypeFile(event.target.files[i]);

        if (fileUpload !== null) {
          var reader = new FileReader();
          reader.onload = (event1: any) => {
            console.log(event1.target.result);
            this.urls.push(event1.target.result);
            this.familyBookFiles.push(event.target.files[i]);
          }
          reader.readAsDataURL(event.target.files[i]);
        }
      }
    }
  }

  verNombrePageFamilyBook(indexPage: any): string {
    let nombreImagen = this.familyBookFiles[indexPage].name;
    return nombreImagen;
  }

  deleteBookFamilyPage(index: any) {
    this.urls.splice(index, 1);
    this.familyBookFiles.splice(index, 1);
    console.log('Tamanio familliBookFiles: ' + this.familyBookFiles.length);
  }

  copySocialNumberSelected(event) {
    let file = event.target.files[0] as File;
    this.copySocialNumber = this.verificaTamanioTypeFile(file);

    this.verSeguroSocial();
  }

  deleteSeguroSocial() {
    this.copySocialNumber = null;
    this.previewSS = "";
  }

  verSeguroSocial() {
    // Show preview
    this.fileData = this.copySocialNumber;
    var mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    var reader = new FileReader();
    reader.readAsDataURL(this.fileData);
    reader.onload = (_event) => {
      this.previewSS = reader.result;
    }
  }



  copyDNIkidSelected(event) {
    let file = event.target.files[0] as File;
    this.copyDNIkid = this.verificaTamanioTypeFile(file);

    this.verDNIA();
  }

  deleteDNIUserA() {
    this.copyDNIkid = null;
    this.previewDNIA = "";
  }

  verDNIA() {
    // Show preview
    this.fileData = this.copyDNIkid;
    var mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    var reader = new FileReader();
    reader.readAsDataURL(this.fileData);
    reader.onload = (_event) => {
      this.previewDNIA = reader.result;
    }
  }

  copyDNIUserB(event) {
    let file = event.target.files[0] as File;
    this.fileDNIUSerB = this.verificaTamanioTypeFile(file);
    this.verDNIB();
  }

  deleteDNIUserB() {
    this.fileDNIUSerB = null;
    this.previewDNIB = "";
  }

  verDNIB() {
    // Show preview
    this.fileData = this.fileDNIUSerB;
    var mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    var reader = new FileReader();
    reader.readAsDataURL(this.fileData);
    reader.onload = (_event) => {
      this.previewDNIB = reader.result;
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
