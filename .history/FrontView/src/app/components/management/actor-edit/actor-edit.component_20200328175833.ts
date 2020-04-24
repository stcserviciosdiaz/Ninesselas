import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { Router } from '@angular/router';
import { bailarin } from 'src/app/models/bailarin';
import { estilosBaile } from 'src/app/models/estilosBaile';
import { cantante } from 'src/app/models/cantante';
import { estilosCanto } from 'src/app/models/estilosCanto';
import { habilidades } from 'src/app/models/habilidades';
import { idiomas } from 'src/app/models/idiomas';
import { deportista } from 'src/app/models/deportista';
import { deportes } from 'src/app/models/deportes';
import { etnia } from 'src/app/models/etnia';
import { HttpClient } from '@angular/common/http';
import { AngularFireStorage } from '@angular/fire/storage';
import { Usuario } from 'src/app/models/usuario';
import { AuthService } from 'src/app/Services/auth.service';
import { musico } from 'src/app/models/musico';
import { instrumento } from 'src/app/models/instrumentos';
import { Observable } from 'rxjs';
import { DateAdapter } from '@angular/material/core';




@Component({
  selector: 'app-actor-edit',
  templateUrl: './actor-edit.component.html',
  styleUrls: ['./actor-edit.component.css']
})
export class ActorEditComponent implements OnInit {
  childForm: FormGroup;
  submitted = false;
  isavailable = false;

  /**URL IMAGENES FIREBASE **/
  obsAvatar: Observable<string>;
  obsFotoCuerpo: Observable<string>;
  obsFotoArtistico: Observable<string>;

  obsMoto: Observable<string>;
  obsCoche: Observable<string>;
  obsTatuajes: Observable<string>;
  obsManos: Observable<string>;

  /**VAriables FILES para fotos */
  avatarFile: File = null;
  fileCuerpoEntero: File = null;
  fileArtistico: File = null;
  fileCoche: File = null;
  fileMoto: File = null;
  fileTatuajes: File = null;
  fileManos: File = null;

  /***variables para carga de imagenes y archivos */
  urlAvatar: string;
  urlCuerpoEntero: string;
  urlArtistico: string;

  urlMoto: string;
  urlCoche: string;
  urlTatuajes: string;
  urlManos: string;

  urlUsuarioA: string;
  urlUsuarioB: string;
  urlSeguroSocial: string;

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
  listaTipoCarnet: string[] = ['Tipo A', 'Tipo B', 'Tipo C', 'Tipo D', 'Tipo BTP'];
  musico;
  instrumentoss;

  //selected
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
    private _adapter: DateAdapter<any>,
    private storage: AngularFireStorage,
    private authService: AuthService,
    public ngxSmartModalService: NgxSmartModalService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this._adapter.setLocale('fr');
  }

  ngOnInit() {
    this.setearDataForm();
    this.llenarCombos();

  }

  ngOnDestroy(): void {
    localStorage.removeItem('actoredit');

  }

  setearDataForm() {
    this.childForm = this.formBuilder.group({

      /****fin variables nuevas */
      username: [''],
      nombres: [''],
      apellidos: [''],
      sexo: [''],
      nombreArtistico: [''],
      videobook: [''],
      bilingue: [''],
      nrocuenta: [''],
      telefono: [''],
      modeloCoche: [''],
      modeloMoto: [''],
      colorCoche: [''],
      colorMoto: [''],
      tipoCarnet: [''],
      carnetConducir: [''],
      fechaNacimiento: [''],
      placebirth: [''],
      nacionalidad: [''],
      email: ['', [Validators.required, Validators.email, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
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
      ultimosTrabajos: [''],
      observaciones: [''],
      acceptTerms: [false, Validators.requiredTrue]
    });

  }

 

  pasarDatosForm() {
    this.childForm.controls.username.setValue(this.usuario.username);
    this.childForm.controls.nombres.setValue(this.usuario.nombres);
    this.childForm.controls.nombreArtistico.setValue(this.usuario.nombreArtistico);
    this.childForm.controls.apellidos.setValue(this.usuario.apellidos);
    this.childForm.controls.sexo.setValue(this.usuario.sexo);
    this.childForm.controls.telefono.setValue(this.usuario.telefono);
    this.childForm.controls.fechaNacimiento.setValue(this.date);
    this.childForm.controls.placebirth.setValue(this.usuario.lugarNacimiento);
    this.childForm.controls.nacionalidad.setValue(this.usuario.nacionalidad);
    this.childForm.controls.email.setValue(this.usuario.email);
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
    this.childForm.controls.tipoCarnet.setValue(this.usuario.tipoCarnetConducir);
    this.childForm.controls.carnetConducir.setValue(this.usuario.carnetConducir);
    this.childForm.controls.videobook.setValue(this.usuario.videobook);
    this.childForm.controls.colorCoche.setValue(this.usuario.cocheList[0].colorCoche);
    this.childForm.controls.modeloCoche.setValue(this.usuario.cocheList[0].modeloCoche);
    this.childForm.controls.colorMoto.setValue(this.usuario.motoList[0].colorMoto);
    this.childForm.controls.modeloMoto.setValue(this.usuario.motoList[0].modeloMoto);
    this.childForm.controls.numeroDNI.setValue(this.usuario.dniUser);
    this.childForm.controls.numeroSeguridadSocial.setValue(this.usuario.numeroSeguroSocial);
    this.childForm.controls.bilingue.setValue(this.usuario.bilingue);
    this.childForm.controls.nrocuenta.setValue(this.usuario.nrocuenta);
    
  }

  pasarEntidadesSelect() {
    this.etniaSelect = this.usuario.idEtnia;
    this.deportistaSelect = this.usuario.idDeportista;
    this.baileSelect = this.usuario.idBailarin;
    this.cantanteSelect = this.usuario.idCantante;
    this.musicoSelect = this.usuario.idMusico;

    this.deporteSelect = this.usuario.deporteList;
    this.estilosBaileSelect = this.usuario.estiloBaileList;
    this.estilosCantoSelect = this.usuario.estilosCantoList;
    this.habilidadessSelect = this.usuario.habilidadesList;
    this.idiomasSelect = this.usuario.idiomasList;
    this.instrumentoSelect = this.usuario.instrumentoList;
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


    /**FOTO DE MANOS */
    filePath = this.usuario.fotosManosList.pop().urlFotoMano;
    ref = this.storage.ref(filePath);
    this.obsManos = ref.getDownloadURL();
    ref.getDownloadURL().subscribe(resp => {
      this.obsManos = resp;
    });

    /**FOTO DE MOTO */
    let variableNull = this.usuario.motoList[0].fotoMoto;

    if (variableNull !== null) {
      filePath = this.usuario.motoList.pop().fotoMoto;
    } else { filePath = 'admin/9999999999/no-moto.jpg'; }

    ref = this.storage.ref(filePath);
    this.obsMoto = ref.getDownloadURL();
    ref.getDownloadURL().subscribe(resp => {
      this.obsMoto = resp;
    });

    /**FOTO DE COCHE */
    variableNull = this.usuario.cocheList[0].fotoCoche;

    if (variableNull !== null) {
      filePath = this.usuario.cocheList.pop().fotoCoche;
    } else { filePath = 'admin/9999999999/no-car.jpg'; }

    ref = this.storage.ref(filePath);
    this.obsCoche = ref.getDownloadURL();
    ref.getDownloadURL().subscribe(resp => {
      this.obsCoche = resp;
    });

    /**FOTO DE TATUAJES */


    variableNull = this.usuario.fotosTatuajesList[0].urlFotoTatuaje;

    if (variableNull !== null) {
      filePath = this.usuario.fotosTatuajesList.pop().urlFotoTatuaje;
    } else { filePath = 'admin/9999999999/no-tatuaje.jpg'; }

    ref = this.storage.ref(filePath);
    this.obsTatuajes = ref.getDownloadURL();
    ref.getDownloadURL().subscribe(resp => {
      this.obsTatuajes = resp;
    });



  }

  pasarUrlPaths() {
    this.urlAvatar = this.usuario.avatar;
    this.urlCuerpoEntero = this.usuario.fotoCuerpo;
    this.urlArtistico = this.usuario.fotoProfesional;

    this.urlMoto = this.usuario.motoList[0].fotoMoto;
    this.urlCoche = this.usuario.cocheList[0].fotoCoche;
    this.urlTatuajes = this.usuario.fotosTatuajesList[0].urlFotoTatuaje;
    this.urlManos = this.usuario.fotosManosList[0].urlFotoMano;
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
    this.authService.finByIdUsuario(localStorage.getItem('actoredit'))
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

        console.log('FECHA PASADA: ' + this.childForm.controls.fechaNacimiento.value)
        this.pasarFotos();
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

  actualizarTalla(idTalla) {
    const newChild = this.childForm.value;
    let tallas = {
      camisaTalla: newChild.tallaCamisa,
      chaquetaTalla: newChild.tallaChaqueta,
      pantalonTalla: newChild.tallaPantalon,
      pieTalla: newChild.pie
    };
    this.authService.editTalla(tallas, idTalla).subscribe(
      () => {
        console.log('talla actualizada');
      },
      (err) => {
        this.ngxSmartModalService.create('confirm', 'Se ha presentado un Error, vuelva a intentarlo y si el problema persiste, contáctenos').open();
        console.log(JSON.stringify(err));
      });
  }

  actualizarCoche(idCoche) {
    const newChild = this.childForm.value;
    let coche = {
      "idCoche": idCoche,
      "colorCoche": newChild.colorCoche,
      "fotoCoche": this.urlCoche,
      "modeloCoche": newChild.modeloCoche
    };
    this.authService.editCoche(coche).subscribe(
      () => {
        console.log('coche actualizada');
      },
      (err) => {
        console.log(JSON.stringify(err));
      });
  }

  actualizarMoto(idMoto) {
    const newChild = this.childForm.value;
    let moto = {
      "idMoto": idMoto,
      "colorMoto": newChild.colorMoto,
      "fotoMoto": this.urlMoto,
      "modeloMoto": newChild.modeloMoto
    };
    this.authService.editMoto(moto).subscribe(
      () => {
        console.log('moto actualizada');
      },
      (err) => {
        console.log(JSON.stringify(err));
      });
  }

  actualizarTatuajes(idTatuaje) {
    let tataje = {
      "idFotoTatuaje": idTatuaje,
      "fechaCargaTatuaje": new Date(),
      "nombreFotoTatuaje": this.fileTatuajes.name,
      "urlFotoTatuaje": this.urlTatuajes
    };
    this.authService.editTatuajes(tataje).subscribe(
      () => {
        console.log('tatuaje actualizada');
      },
      (err) => {
        console.log(JSON.stringify(err));
      });
  }

  actualizarManos(idManos) {
    let manos = {
      "idFotoMano": idManos,
      "fechaCargaMano": new Date(),
      "nombreFotoMano": this.fileManos.name,
      "urlFotoMano": this.urlManos
    };
    this.authService.editManos(manos).subscribe(
      () => {
        console.log('mano actualizada');
      },
      (err) => {
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
      bilingue: newChild.bilingue,
      nrocuenta: newChild.nrocuenta,
      carnetConducir: newChild.carnetConducir,
      tipoCarnetConducir: newChild.tipoCarnet,
      codigoPostal: newChild.codpostal,
      colorOjos: newChild.colorOjos,
      colorPelo: newChild.colorPelo,
      colorPiel: newChild.colorPiel,
      curriculumVitae: '',
      direccion: newChild.direccion,
      dniMadre: '',
      dniRepresentante: '',
      dniPadre: '',
      dniUser: newChild.numeroDNI,
      email: newChild.email,
      fechaNacimiento: this.date,
      libroFamilia: '',
      libroFamiliarList: [],
      pathDniMadreB: '',
      pathDniPadreB: '',
      pathDniUserB: this.urlUsuarioB,
      localidad: newChild.localidad,
      nacionalidad: newChild.nacionalidad,
      nombreArtistico: newChild.nombreArtistico,
      nombreCompleto: '',
      nombres: newChild.nombres,
      numeroSeguroSocial: newChild.numeroSeguridadSocial,
      observaciones: '',
      password: this.usuario.password,
      pathDniMadre: '',
      pathDniPadre: '',
      pathDniUser: this.urlUsuarioA,
      pathDniRepresentante: '',
      pathSeguroSocial: this.urlSeguroSocial,
      provincia: newChild.provincia,
      sexo: newChild.sexo,
      telefono: newChild.telefono,
      telefonoMadre: newChild.telefonomother,
      telefonoPadre: newChild.telefonofather,
      lugarNacimiento: newChild.placebirth,
      edad: 0,
      actor: 'SI',
      username: newChild.username,
      videobook: newChild.videobook,
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
        localStorage.removeItem('actoredit');

        this.actualizarTalla(res.tallasList[0].idTalla);
        if (this.usuario.cocheList !== null && typeof(this.usuario.cocheList.pop()) !== 'undefined') {
          this.actualizarCoche(this.usuario.cocheList[0].idCoche);
        }
        if (this.usuario.motoList !== null && typeof(this.usuario.motoList.pop()) !== 'undefined') {
          this.actualizarMoto(this.usuario.motoList[0].idMoto);
        }

        if (this.fileTatuajes !== null) {
          this.actualizarTatuajes(this.usuario.fotosTatuajesList[0].idFotoTatuaje);
        }
        if (this.fileManos !== null) {
          this.actualizarManos(this.usuario.fotosManosList[0].idFotoMano);
        }
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

  subirArchivos() {
    /**subir avatar */
    let idUser = this.childForm.get('numeroDNI').value;
    let task: any;
    if (this.avatarFile !== null) {
      this.urlAvatar = 'figuracion/' + idUser + '/avatar-' + this.avatarFile.name;
      task = this.storage.upload(this.urlAvatar, this.avatarFile);
    }
    /**subir cuerpo entero */
    if (this.fileCuerpoEntero !== null) {
      this.urlCuerpoEntero = 'figuracion/' + idUser + '/cuerpo-' + this.fileCuerpoEntero.name;
      task = this.storage.upload(this.urlCuerpoEntero, this.fileCuerpoEntero);
    }
    /**subir foto artistica */
    if (this.fileArtistico !== null) {
      this.urlArtistico = 'figuracion/' + idUser + '/artistico-' + this.fileArtistico.name;
      task = this.storage.upload(this.urlArtistico, this.fileArtistico);
    }

    /**subir coche */
    if (this.fileCoche !== null) {
      this.urlCoche = 'figuracion/' + idUser + '/coche-' + this.fileCoche.name;
      task = this.storage.upload(this.urlCoche, this.fileCoche);
    }
    /**subir moto */
    if (this.fileMoto !== null) {
      this.urlMoto = 'figuracion/' + idUser + '/moto-' + this.fileMoto.name;
      task = this.storage.upload(this.urlMoto, this.fileMoto);
    }
    /**subir tatuajes */
    if (this.fileTatuajes !== null) {
      this.urlTatuajes = 'figuracion/' + idUser + '/tatuajes-' + this.fileTatuajes.name;
      task = this.storage.upload(this.urlTatuajes, this.fileTatuajes);
    }
    /**subir manos */
    if (this.fileManos !== null) {
      this.urlManos = 'figuracion/' + idUser + '/manos-' + this.fileManos.name;
      task = this.storage.upload(this.urlManos, this.fileManos);
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






