import { Component, Input, OnDestroy, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { NgxSmartModalService, NgxSmartModalComponent } from 'ngx-smart-modal';
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
import { Usuario } from 'src/app/models/usuario';
import { AuthService } from 'src/app/Services/auth.service';
import { libroFamiliar } from 'src/app/models/libroFamiliar';
import { error } from 'util';


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
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {

  matcher = new MyErrorStateMatcher();
  childForm: FormGroup;
  submitted = false;
  isavailable = false;
  date;
  tamanioFotos = 4;//MB


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

  fileDNIA: File = null;
  fileDNIB: File = null;
  fileSeguroSocial: File = null;


  /**URL IMAGENES FIREBASE **/
  obsAvatar: Observable<string>;
  obsFotoCuerpo: Observable<string>;
  obsFotoArtistico: Observable<string>;

  obsDniUser: Observable<string>;
  obsDniUserB: Observable<string>;
  obsSeguroUser: Observable<string>;
  obsDniPadre: Observable<string>;
  obsDniMadre: Observable<string>;
  obsDniPadreB: Observable<string>;
  obsDniMadreB: Observable<string>;
  obsLibroFamiliar: Observable<string>;


  /***PREVIEW FOTOS */
  previewAvatar: any = null;
  previewCuerpo: any = null;
  previewSeguroSocial: any = null;
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
  urlUsuarioB: string;
  urlPadreB: string;
  urlMadreB: string;

  /*******variables para combos********/
  edades = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
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
  edadSelect:any;
  actorSelect;
  usuario: Usuario = new Usuario();
  usuarioEdit: Usuario = new Usuario();
  etniaSelect: etnia = new etnia();
  baileSelect: bailarin = new bailarin();
  cantanteSelect: cantante = new cantante();
  deportistaSelect: deportista = new deportista();
  musicoSelect: musico = new musico();

  estilosBaileSelect: estilosBaile[] = [];
  estilosCantoSelect: estilosCanto[] = [];
  habilidadessSelect: habilidades[] = [];
  idiomasSelect: idiomas[] = [];
  deporteSelect: deportes[] = [];
  instrumentoSelect: instrumento[] = [];

  libroFamiliarList: libroFamiliar[] = [];
  urlsLibroFamiliar = [];
  libroFamiliarFileList: File[] = [];
  listLibroFamiliar: libroFamiliar[] = [];

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
    this.setearDataForm();
    this.llenarCombos();
  }

  ngOnDestroy(): void {
    localStorage.removeItem('ninioedit');

  }

  goTop() {
    var elmnt = document.getElementById("divInicial");
    elmnt.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  setearDataForm() {
    this.childForm = this.formBuilder.group({

      /****fin variables nuevas */
      username: [''],
      nombres: [''],
      apellidos: [''],
      edad: [''],
      sexo: [''],
      nrocuenta: [''],
      bilingue: [''],
      telefono: [''],
      fechaNacimiento: [''],
      placebirth: [''],
      nacionalidad: [''],
      email: ['', [Validators.required, Validators.email, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      actor: [''],
      videoBook: [''],
      tallaCamisa: [''],
      tallaChaqueta: [''],
      tallaPantalon: [''],
      pie: [''],
      altura: [''],
      colorPiel: [''],
      colorPelo: [''],
      colorOjos: [''],
      direccion: [''],
      localidad: [''],
      provincia: [''],
      codpostal: [''],
      numeroDNI: [''],
      numeroSeguridadSocial: [''],
      numeroDNIPadre: [''],
      telefonofather: [''],
      numeroDNIMadre: [''],
      telefonomother: [''],
      ultimosTrabajos: [''],
      observaciones: [''],
      utTeatro: [''],
      utCine: [''],
      utFiccion: [''],
      utPublicidad: [''],
      acceptTerms: [false, Validators.requiredTrue]
    });

  }

  pasarDatosForm() {
    this.childForm.controls.username.setValue(this.usuario.username);
    this.childForm.controls.nombres.setValue(this.usuario.nombres);
    this.childForm.controls.apellidos.setValue(this.usuario.apellidos);
    this.childForm.controls.edad.setValue(this.usuario.edad);
    this.childForm.controls.sexo.setValue(this.usuario.sexo);
    this.childForm.controls.telefono.setValue(this.usuario.telefono);
    this.childForm.controls.fechaNacimiento.setValue(this.usuario.fechaNacimiento);
    this.childForm.controls.placebirth.setValue(this.usuario.lugarNacimiento);
    this.childForm.controls.nacionalidad.setValue(this.usuario.nacionalidad);
    this.childForm.controls.email.setValue(this.usuario.email);
    this.childForm.controls.actor.setValue({ name: this.usuario.actor });
    this.childForm.controls.tallaCamisa.setValue(this.usuario.tallasList[0].camisaTalla);
    this.childForm.controls.tallaChaqueta.setValue(this.usuario.tallasList[0].chaquetaTalla);
    this.childForm.controls.tallaPantalon.setValue(this.usuario.tallasList[0].pantalonTalla);
    this.childForm.controls.pie.setValue(this.usuario.tallasList[0].pieTalla);
    this.childForm.controls.altura.setValue(this.usuario.altura);
    this.childForm.controls.colorPiel.setValue(this.usuario.colorPiel);
    this.childForm.controls.colorPelo.setValue(this.usuario.colorPelo);
    this.childForm.controls.colorOjos.setValue(this.usuario.colorOjos);
    this.childForm.controls.direccion.setValue(this.usuario.direccion);
    this.childForm.controls.localidad.setValue(this.usuario.localidad);
    this.childForm.controls.provincia.setValue(this.usuario.provincia);
    this.childForm.controls.codpostal.setValue(this.usuario.codigoPostal);
    this.childForm.controls.numeroDNI.setValue(this.usuario.dniUser);
    this.childForm.controls.numeroSeguridadSocial.setValue(this.usuario.numeroSeguroSocial);
    this.childForm.controls.numeroDNIPadre.setValue(this.usuario.dniPadre);
    this.childForm.controls.numeroDNIMadre.setValue(this.usuario.dniMadre);
    //this.childForm.controls.numeroDNIRepresentante.setValue(this.usuario.dniRepresentante);
    this.childForm.controls.telefonofather.setValue(this.usuario.telefonoPadre);
    this.childForm.controls.telefonomother.setValue(this.usuario.telefonoMadre);
    this.childForm.controls.videoBook.setValue(this.usuario.videobook);

    this.childForm.controls.bilingue.setValue(this.usuario.bilingue);
    this.childForm.controls.nrocuenta.setValue(this.usuario.nrocuenta);
    this.childForm.controls.observaciones.setValue(this.usuario.observaciones);


    this.childForm.controls.utTeatro.setValue(this.usuario.ultimosTrabajosList[0].nombreUltimoTrabajo);
    this.childForm.controls.utCine.setValue(this.usuario.ultimosTrabajosList[1].nombreUltimoTrabajo);
    this.childForm.controls.utFiccion.setValue(this.usuario.ultimosTrabajosList[2].nombreUltimoTrabajo);
    this.childForm.controls.utPublicidad.setValue(this.usuario.ultimosTrabajosList[3].nombreUltimoTrabajo);

    this.actorSelect = { name: this.usuario.actor };
    this.edadSelect = this.usuario.edad;
  }

  pasarEntidadesSelect() {
    this.etniaSelect = this.usuario.idEtnia;
    this.deportistaSelect = this.usuario.idDeportista;
    this.cantanteSelect = this.usuario.idCantante;
    this.baileSelect = this.usuario.idBailarin;
    this.musicoSelect = this.usuario.idMusico;

    this.deporteSelect = this.usuario.deporteList;
    this.estilosBaileSelect = this.usuario.estiloBaileList;
    this.instrumentoSelect = this.usuario.instrumentoList;
    this.estilosCantoSelect = this.usuario.estilosCantoList;
    this.habilidadessSelect = this.usuario.habilidadesList;
    this.idiomasSelect = this.usuario.idiomasList;
  }


  pasarFotos() {
    let filePath = this.usuario.avatar;
    let ref = this.storage.ref(filePath);

    /**AVATAR */
    this.obsAvatar = ref.getDownloadURL();
    ref.getDownloadURL().subscribe(resp => {
      this.obsAvatar = resp;
    });


    /**FOTO CUERPO ENTERO */
    filePath = this.usuario.fotoCuerpo;
    ref = this.storage.ref(filePath);
    this.obsFotoCuerpo = ref.getDownloadURL();
    ref.getDownloadURL().subscribe(resp => {
      this.obsFotoCuerpo = resp;
    });

    /**FOTO PROFESIONAL */
    filePath = this.usuario.fotoProfesional;
    ref = this.storage.ref(filePath);
    this.obsFotoArtistico = ref.getDownloadURL();
    ref.getDownloadURL().subscribe(resp => {
      this.obsFotoArtistico = resp;
    });

    /**FOTO DE DNI */
    let variableNull = this.usuario.pathDniUser;

    if (variableNull !== null) {
      filePath = this.usuario.pathDniUser;
    } else { filePath = 'admin/9999999999/no-imagen.png'; }

    ref = this.storage.ref(filePath);
    this.obsDniUser = ref.getDownloadURL();
    ref.getDownloadURL().subscribe(resp => {
      this.obsDniUser = resp;
    });

    /**FOTO DE DNI LABO B*/
    variableNull = this.usuario.pathDniUserB;

    if (variableNull !== null) {
      filePath = this.usuario.pathDniUserB;
    } else { filePath = 'admin/9999999999/no-imagen.png'; }

    ref = this.storage.ref(filePath);
    this.obsDniUserB = ref.getDownloadURL();
    ref.getDownloadURL().subscribe(resp => {
      this.obsDniUserB = resp;
    });

    /**FOTO DE SEGURO */
    variableNull = this.usuario.pathSeguroSocial;

    if (variableNull !== null) {
      filePath = this.usuario.pathSeguroSocial;
    } else { filePath = 'admin/9999999999/no-imagen.png'; }

    ref = this.storage.ref(filePath);
    this.obsSeguroUser = ref.getDownloadURL();
    ref.getDownloadURL().subscribe(resp => {
      this.obsSeguroUser = resp;
    });

    /**FOTO DE DNI PADRE */
    variableNull = this.usuario.pathDniPadre;

    if (variableNull !== null) {
      filePath = this.usuario.pathDniPadre;
    } else { filePath = 'admin/9999999999/no-imagen.png'; }

    ref = this.storage.ref(filePath);
    this.obsDniPadre = ref.getDownloadURL();
    ref.getDownloadURL().subscribe(resp => {
      this.obsDniPadre = resp;
    });

    variableNull = this.usuario.pathDniPadreB;

    if (variableNull !== null) {
      filePath = this.usuario.pathDniPadreB;
    } else { filePath = 'admin/9999999999/no-imagen.png'; }

    ref = this.storage.ref(filePath);
    this.obsDniPadreB = ref.getDownloadURL();
    ref.getDownloadURL().subscribe(resp => {
      this.obsDniPadreB = resp;
    });

    /**FOTO DE DNI MADRE */
    variableNull = this.usuario.pathDniMadre;

    if (variableNull !== null) {
      filePath = this.usuario.pathDniMadre;
    } else { filePath = 'admin/9999999999/no-imagen.png'; }

    ref = this.storage.ref(filePath);
    this.obsDniMadre = ref.getDownloadURL();
    ref.getDownloadURL().subscribe(resp => {
      this.obsDniMadre = resp;
    });

    variableNull = this.usuario.pathDniMadreB;

    if (variableNull !== null) {
      filePath = this.usuario.pathDniMadreB;
    } else { filePath = 'admin/9999999999/no-imagen.png'; }

    ref = this.storage.ref(filePath);
    this.obsDniMadreB = ref.getDownloadURL();
    ref.getDownloadURL().subscribe(resp => {
      this.obsDniMadreB = resp;
    });

    /**FOTO DE LIBRO FAMILIAR */
    this.listLibroFamiliar = this.usuario.libroFamiliarList;
    for (var x = 0; x < this.listLibroFamiliar.length; x++) {
      this.verImagenFB(this.listLibroFamiliar[x].urlFotoLibro, x);
    }
  }

  verImagenFB(filePath, index) {
    let ref = this.storage.ref(filePath);
    ref.getDownloadURL().subscribe(resp => {
      this.listLibroFamiliar[index].urlFotoLibro = resp;
    });
  }


  pasarUrlPaths() {
    this.urlAvatar = this.usuario.avatar;
    this.urlUsuario = this.usuario.pathDniUser;
    this.urlSegurosocial = this.usuario.pathSeguroSocial;
    this.urlPadre = this.usuario.pathDniPadre;
    this.urlMadre = this.usuario.pathDniMadre;
    this.urlLibroFamilia = this.usuario.libroFamilia;
    this.urlRepresentante = this.usuario.pathDniRepresentante;
    this.urlCuerpoEntero = this.usuario.fotoCuerpo;
    this.urlArtistico = this.usuario.fotoProfesional;
  }

  onChangeDate($event) {
    let date1 = new Date($event.value);
    this.date = new Date();
    this.date.setDate(date1.getUTCDate());
    this.date.setMonth(date1.getUTCMonth());
    this.date.setFullYear(date1.getUTCFullYear());
  }

  llenarCombos() {

    //llenado de etnias
    this.authService.finByIdUsuario(localStorage.getItem('ninioedit'))
      .pipe().subscribe(res => {
        this.usuario = res;

        let fecha = new Date(this.usuario.fechaNacimiento);
        this.date = new Date();
        this.date.setDate(fecha.getUTCDate());
        this.date.setMonth(fecha.getUTCMonth());
        this.date.setFullYear(fecha.getUTCFullYear());

        this.pasarEntidadesSelect();
        this.pasarUrlPaths();
        this.pasarDatosForm();
        this.pasarFotos();



        /**Previsualizacion de imagen del storage */
        /*let storageRef = this.storage.ref(this.usuario.avatar);
        storageRef.getDownloadURL().subscribe(url => this.urlImage = url);
        */
      });


    //llenado de etnias
    this.authService.getAllEtinas()
      .subscribe(resp => {
        this.etnias = resp;
      });

    //llenado de baile
    this.authService.getAllBailarin()
      .subscribe(resp => {
        this.baile = resp;
      });

    //llenado de estilos baile
    this.authService.getAllEstilosBailes()
      .subscribe(resp => {
        this.estilosBaile = resp;
      });

    //llenado de cantate
    this.authService.getAllCantante()
      .subscribe(resp => {
        this.cantante = resp;
      });

    //llenado de estilosCanto
    this.authService.getAllEstilosCanto()
      .subscribe(resp => {
        this.estilosCanto = resp;
      });

    //llenado de habilidadess
    this.authService.getAllHabilidades()
      .subscribe(resp => {
        this.habilidadess = resp;
      });

    //llenado de idiomas
    this.authService.getAllIdiomas()
      .subscribe(resp => {
        this.idiomas = resp;
      });

    //llenado de deportista
    this.authService.getAllDeportista()
      .subscribe(resp => {
        this.deportista = resp;
      });

    //llenado de deportes
    this.authService.getAllDeportes()
      .subscribe(resp => {
        this.deportes = resp;
      });

    //llenado de musico
    this.authService.getAllMusico()
      .subscribe(resp => {
        this.musico = resp;
      });

    //llenado de instrumento
    this.authService.getAllInstrumentos()
      .subscribe(resp => {
        this.instrumentoss = resp;
      });
  }

  actualizarTalla(idUser, idTalla) {
    const newChild = this.childForm.value;
    let tallas = {
      camisaTalla: newChild.tallaCamisa,
      chaquetaTalla: newChild.tallaChaqueta,
      pantalonTalla: newChild.tallaPantalon,
      pieTalla: newChild.pie
    };
    this.authService.editTalla(tallas, idTalla).subscribe(
      resTalla => {
        console.log('talla actualizada');
      },
      (err) => {
        this.ngxSmartModalService.create('confirm', 'Se ha presentado un Error, vuelva a intentarlo y si el problema persiste, contáctenos').open();
        console.log(JSON.stringify(err));
      });
  }

  actualizarLibro(idUser) {
    let filesAmount = this.listLibroFamiliar.length;
    let indexFileCoche = 0;
    for (let i = 0; i < filesAmount; i++) {
      let libro = {
        idLibro: this.listLibroFamiliar[i].idLibro,
        fechaCargaLibro: new Date(),
        nombreFotoLibro: this.listLibroFamiliar[i].nombreFotoLibro,
        urlFotoLibro: this.listLibroFamiliar[i].urlFotoLibro,
        idUser: idUser
      }

      if (this.listLibroFamiliar[i].idLibro === 0) {
        let dnuIser = this.childForm.get('numeroDNI').value;
        let url = 'ninios/' + dnuIser + '/libro-' + this.libroFamiliarFileList[indexFileCoche].name;
        indexFileCoche++;
        libro.urlFotoLibro = url;
        /***GUARDE CON SERVICIO */
        this.authService.saveLibroFamiliar(libro).subscribe(
          resTalla => {
            console.log('info libro save');
          },
          (err) => {
            console.log('error save libro');
          });
      } else {
        /***ACTUALIZA CON SERVICIO */
        this.authService.findByIdLibro(libro.idLibro).subscribe(
          resp => {
            libro.urlFotoLibro = resp.urlFotoLibro;
            this.authService.editCoche(libro).subscribe(
              resTalla => {
                console.log('info edit libro');
              },
              (err) => {
                console.log('error edit libro');
              });
          });

      }
    }
  }

  actualizarUltimosTrabajos(idUser) {
    const newUserObject = this.childForm.value;
    let ut = this.usuario.ultimosTrabajosList;
    let ultimosTrabajosList = [{
      idUltimosTrabajos: ut[0].idUltimosTrabajos,
      descripcionUltimoTrabajo: newUserObject.utTeatro,
      nombreUltimoTrabajo: newUserObject.utTeatro,
      idUser: idUser
    },
    {
      idUltimosTrabajos: ut[1].idUltimosTrabajos,
      descripcionUltimoTrabajo: newUserObject.utCine,
      nombreUltimoTrabajo: newUserObject.utCine,
      idUser: idUser
    },
    {
      idUltimosTrabajos: ut[2].idUltimosTrabajos,
      descripcionUltimoTrabajo: newUserObject.utFiccion,
      nombreUltimoTrabajo: newUserObject.utFiccion,
      idUser: idUser
    },
    {
      idUltimosTrabajos: ut[3].idUltimosTrabajos,
      descripcionUltimoTrabajo: newUserObject.utPublicidad,
      nombreUltimoTrabajo: newUserObject.utPublicidad,
      idUser: idUser
    }
    ]

    for (let x = 0; x < ultimosTrabajosList.length; x++) {
      this.authService.editUltimosTrabajos(ultimosTrabajosList[x]).subscribe(
        resTalla => {
          console.log('ut actualizada');
        },
        (err) => {
          console.log(JSON.stringify(err));
        });
    }
  }

  pasarDatosFormUsuario() {

    const newChild = this.childForm.value;
    this.usuarioEdit = {
      idUser: this.usuario.idUser,
      avatar: this.urlAvatar,
      fotoCuerpo: this.urlCuerpoEntero,
      fotoProfesional: this.urlArtistico,
      acento: '',
      altura: newChild.altura,
      apellidos: newChild.apellidos,
      bilingue: newChild.bilingue,
      nrocuenta: newChild.nrocuenta,
      carnetConducir: '',
      tipoCarnetConducir: '',
      codigoPostal: newChild.codpostal,
      colorOjos: newChild.colorOjos,
      colorPelo: newChild.colorPelo,
      colorPiel: newChild.colorPiel,
      curriculumVitae: '',
      direccion: newChild.direccion,
      dniMadre: newChild.numeroDNIMadre,
      dniRepresentante: newChild.numeroDNIRepresentante,
      dniPadre: newChild.numeroDNIPadre,
      dniUser: newChild.numeroDNI,
      email: newChild.email,
      fechaNacimiento: this.date,
      libroFamilia: this.urlLibroFamilia,
      libroFamiliarList: [],
      localidad: newChild.localidad,
      nacionalidad: newChild.nacionalidad,
      nombreArtistico: '',
      nombreCompleto: '',
      nombres: newChild.nombres,
      numeroSeguroSocial: newChild.numeroSeguridadSocial,
      observaciones: newChild.observaciones,
      password: this.usuario.password,
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
      edad: this.edadSelect,
      actor: newChild.actor.name,
      username: newChild.username,
      videobook: newChild.videoBook,
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
        idType: this.usuario.idType.idType,
        description: this.usuario.idType.description,
        nombres: this.usuario.idType.nombres
      },
      idDeportista: this.deportistaSelect,
      idMusico: this.musicoSelect,
      motoList: [],
      cocheList: [],
      fotosTatuajesList: [],
      fotosManosList: []
    };

  }


  isChecked(idItem, id): boolean {
    if (id === 1) {
      const valor = this.deporteSelect.find(x => x.nombreDeporte === idItem);
      if (valor)
        return true;
      else return false;
    } else if (id === 2) {
      const valor = this.instrumentoSelect.find(x => x.nombreInstrumento === idItem);
      if (valor)
        return true;
      else return false;
    } else if (id === 3) {
      const valor = this.estilosBaileSelect.find(x => x.nombreBaile === idItem);
      if (valor)
        return true;
      else return false;
    } else if (id === 4) {
      const valor = this.estilosCantoSelect.find(x => x.nombreEstiloCanto === idItem);
      if (valor)
        return true;
      else return false;
    } else if (id === 5) {
      const valor = this.habilidadessSelect.find(x => x.nombreHabilidad === idItem);
      if (valor)
        return true;
      else return false;
    } else if (id === 6) {
      const valor = this.idiomasSelect.find(x => x.nombreIdioma === idItem);
      if (valor)
        return true;
      else return false;
    }
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
        this.instrumentoSelect.push(item);
      } else {
        const index: number = this.instrumentoSelect.indexOf(item);
        this.instrumentoSelect.splice(index, 1);
      }
    } else if (id === 3) {
      if ($event.checked) {
        this.estilosBaileSelect.push(item);
      } else {
        const index: number = this.estilosBaileSelect.indexOf(item);
        this.estilosBaileSelect.splice(index, 1);
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

  signupChild() {

    this.submitted = true;


    if (this.childForm.invalid) {

      this.ngxSmartModalService.create('confirm', 'Pofavor, Llenar el formulario con todos los datos').open();
      console.log('JSON: '+JSON.stringify(this.childForm.value));

      return;
    }
    this.subirArchivos();
    this.pasarDatosFormUsuario();
    this.authService.editUser(this.usuarioEdit).subscribe(
      res => {
        localStorage.removeItem('ninioedit');
        this.actualizarTalla(this.usuario.idUser, res.tallasList[0].idTalla);
        this.actualizarLibro(this.usuario.idUser);
        this.actualizarUltimosTrabajos(this.usuario.idUser);

        this.ngxSmartModalService.create('EDICION', 'Cuenta actualizada exitosamente ').open();
        this.router.navigate(['/management']);
      },
      (err) => {
        this.ngxSmartModalService.create('confirm', 'Se ha presentado un Error, vuelva a intentarlo y si el problema persiste, contáctenos').open();
        console.log(JSON.stringify(err));
      });
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

  copySocialNumberSelected(event) {
    let file = event.target.files[0] as File;
    this.copySocialNumber = this.verificaTamanioTypeFile(file);

    this.verSeguroSocial();
  }

  deleteSeguroSocial() {
    this.copySocialNumber = null;
    this.previewSS = "";
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




  subirArchivos() {
    /**subir avatar */
    let idUser = this.childForm.get('numeroDNI').value;
    let task: any;
    if (this.avatarFile !== null) {
      this.urlAvatar = 'ninios/' + idUser + '/avatar-' + this.avatarFile.name;
      task = this.storage.upload(this.urlAvatar, this.avatarFile);
    }
    /**subir cuerpo entero */
    if (this.fileCuerpoEntero !== null) {
      this.urlCuerpoEntero = 'ninios/' + idUser + '/cuerpo-' + this.fileCuerpoEntero.name;
      task = this.storage.upload(this.urlCuerpoEntero, this.fileCuerpoEntero);
    }
    /**subir foto artistica */
    if (this.fileArtistico !== null) {
      this.urlArtistico = 'ninios/' + idUser + '/artistico-' + this.fileArtistico.name;
      task = this.storage.upload(this.urlArtistico, this.fileArtistico);
    }
    if (this.copyDNIFather != null) {
      /**subir dnipadre */
      this.urlPadre = 'ninios/' + idUser + '/dnipadre-' + this.copyDNIFather.name;
      task = this.storage.upload(this.urlPadre, this.copyDNIFather);
    }
    if (this.fileDNIPadreB != null) {
      /**subir dnipadre */
      this.urlPadreB = 'ninios/' + idUser + '/dnipadreb-' + this.fileDNIPadreB.name;
      task = this.storage.upload(this.urlPadreB, this.fileDNIPadreB);
    }
    if (this.CopyDNIMother != null) {
      /**subir dnimadre */
      this.urlMadre = 'ninios/' + idUser + '/dnimadre-' + this.CopyDNIMother.name;
      task = this.storage.upload(this.urlMadre, this.CopyDNIMother);
    }
    if (this.fileDNIMadreB != null) {
      /**subir dnimadre */
      this.urlMadreB = 'ninios/' + idUser + '/dnimadreb-' + this.fileDNIMadreB.name;
      task = this.storage.upload(this.urlMadreB, this.fileDNIMadreB);
    }

    /**subir family book  */
    if (this.libroFamiliarFileList !== null) {
      var filesAmount = this.libroFamiliarFileList.length;
      for (let i = 0; i < filesAmount; i++) {
        this.urlLibroFamilia = 'ninios/' + idUser + '/libro-' + this.libroFamiliarFileList[i].name;
        task = this.storage.upload(this.urlLibroFamilia, this.libroFamiliarFileList[i]);
      }
    }
    /**subir numero de seguro social  */
    if (this.copySocialNumber !== null) {
      this.urlSegurosocial = 'ninios/' + idUser + '/segurosocial-' + this.copySocialNumber.name;
      task = this.storage.upload(this.urlSegurosocial, this.copySocialNumber);
    }
    /**subir dni user  */
    if (this.copyDNIkid !== null) {
      this.urlUsuario = 'ninios/' + idUser + '/dniuser-' + this.copyDNIkid.name;
      task = this.storage.upload(this.urlUsuario, this.copyDNIkid);
    }
    /**subir dni user  B*/
    if (this.fileDNIUSerB != null) {
      this.urlUsuarioB = 'ninios/' + idUser + '/dniuserb-' + this.fileDNIUSerB.name;
      task = this.storage.upload(this.urlUsuarioB, this.fileDNIUSerB);
    }
  }

  /**Upload foto tatuajes */
  onFileLibroSelected(event) {

    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {

        let fileUpload = this.verificaTamanioTypeFile(event.target.files[i]);

        if (fileUpload !== null) {
          var reader = new FileReader();
          reader.onload = (event1: any) => {
            this.urlsLibroFamiliar.push(event1.target.result);
            this.libroFamiliarFileList.push(event.target.files[i]);
            let libro = {
              idLibro: 0,
              fechaCargaLibro: new Date(),
              nombreFotoLibro: event.target.files[i].name,
              urlFotoLibro: event1.target.result
            };
            this.listLibroFamiliar.push(libro);
          }
          reader.readAsDataURL(event.target.files[i]);
        }
      }
    }
  }

  verNombreLibroPage(indexPage: any): string {
    let nombreImagen = this.listLibroFamiliar[indexPage].nombreFotoLibro;
    return nombreImagen;
  }

  indexDeleteTatuaje: any;
  idDeleteTatuaje: any;
  confirmDeleteLibro(index: any) {
    this.indexDeleteTatuaje = index;
    this.idDeleteTatuaje = this.listLibroFamiliar[index].idLibro;
  }

  deleteLibroPage() {
    if (this.idDeleteTatuaje !== 0) {
      this.authService.deleteLibroFamiliar(this.idDeleteTatuaje)
        .subscribe(resp => {
        });
    }
    this.urlsLibroFamiliar.splice(this.indexDeleteTatuaje, 1);
    this.libroFamiliarFileList.splice(this.indexDeleteTatuaje, 1);
    this.listLibroFamiliar.splice(this.indexDeleteTatuaje, 1);
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

