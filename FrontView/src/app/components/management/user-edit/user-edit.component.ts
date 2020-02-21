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

  /**URL IMAGENES FIREBASE **/
  obsAvatar: Observable<string>;
  obsFotoCuerpo: Observable<string>;
  obsFotoArtistico: Observable<string>;

  obsDniUser: Observable<string>;
  obsSeguroUser: Observable<string>;
  obsDniPadre: Observable<string>;
  obsDniMadre: Observable<string>;
  obsLibroFamiliar: Observable<string>;

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

  setearDataForm() {
    this.childForm = this.formBuilder.group({

      /****fin variables nuevas */
      username: [''],
      nombres: [''],
      apellidos: [''],
      edad: [''],
      sexo: [''],
      // bilingue: [''],
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
      telefonofather: ['', [Validators.required, Validators.minLength(6)]],
      numeroDNIMadre: [''],
      telefonomother: ['', [Validators.required, Validators.minLength(6)]],
      ultimosTrabajos: [''],
      observaciones: [''],
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

    /*
        this.childForm.controls.etnias.setValue(this.etniaSelect);
        this.childForm.controls.deportista.setValue(this.deportistaSelect);
        this.childForm.controls.deportes.setValue(this.deporteSelect);
        this.childForm.controls.baile.setValue(this.baileSelect);
        this.childForm.controls.estilosBaile.setValue(this.estilosBaileSelect);
        this.childForm.controls.musico.setValue(this.musicoSelect);
        this.childForm.controls.instrumentoss.setValue(this.instrumentoSelect);
        this.childForm.controls.cantante.setValue(this.cantanteSelect);
        this.childForm.controls.estilosCanto.setValue(this.estilosCantoSelect);
        this.childForm.controls.habilidadess.setValue(this.habilidadessSelect);
        this.childForm.controls.idiomas.setValue(this.idiomasSelect);
    */



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

    /**FOTO DE LIBRO FAMILIAR */
    variableNull = this.usuario.libroFamilia;

    if (variableNull !== null) {
      filePath = this.usuario.libroFamilia;
    } else { filePath = 'admin/9999999999/no-imagen.png'; }

    ref = this.storage.ref(filePath);
    this.obsLibroFamiliar = ref.getDownloadURL();
    ref.getDownloadURL().subscribe(resp => {
      this.obsLibroFamiliar = resp;
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
      bilingue: '',
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
      localidad: newChild.localidad,
      nacionalidad: newChild.nacionalidad,
      nombreArtistico: '',
      nombreCompleto: '',
      nombres: newChild.nombres,
      numeroSeguroSocial: newChild.numeroSeguridadSocial,
      observaciones: '',
      password: this.usuario.password,
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

    if (this.childForm.invalid || this.childForm.get('acceptTerms').value === false) {
      this.ngxSmartModalService.create('confirm', 'Pofavor, Llenar el formulario con todos los datos').open();
      return;
    }
    this.subirArchivos();
    this.pasarDatosFormUsuario();
    this.authService.editUser(this.usuarioEdit).subscribe(
      res => {
        localStorage.removeItem('ninioedit');
        this.actualizarTalla(this.usuario.idUser, res.tallasList[0].idTalla);
        this.ngxSmartModalService.create('EDICION', 'Cuenta actualizada exitosamente ').open();
        this.router.navigate(['/management']);
      },
      (err) => {
        this.ngxSmartModalService.create('confirm', 'Se ha presentado un Error, vuelva a intentarlo y si el problema persiste, contáctenos').open();
        console.log(JSON.stringify(err));
      });
  }

  /**Upload foto avatar */
  onAvatarSelected(event) {
    this.avatarFile = event.target.files[0] as File;

    /**Previsualizacion del select file image */
    //this.preview(this.avatarFile);
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
    //    this.preview();
  }

  preview(file: any) {
    // Show preview
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (_event) => {
      this.previewUrl = reader.result;
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
    /**subir dnipadre */
    if (this.copyDNIFather !== null) {
      this.urlPadre = 'ninios/' + idUser + '/dnipadre-' + this.copyDNIFather.name;
      task = this.storage.upload(this.urlPadre, this.copyDNIFather);
    }
    /**subir dnimadre */
    if (this.CopyDNIMother !== null) {
      this.urlMadre = 'ninios/' + idUser + '/dnimadre-' + this.CopyDNIMother.name;
      task = this.storage.upload(this.urlMadre, this.CopyDNIMother);
    }
    /**subir family book  */
    if (this.familyBookFile !== null) {
      this.urlLibroFamilia = 'ninios/' + idUser + '/librofamiliar-' + this.familyBookFile.name;
      task = this.storage.upload(this.urlLibroFamilia, this.familyBookFile);
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

