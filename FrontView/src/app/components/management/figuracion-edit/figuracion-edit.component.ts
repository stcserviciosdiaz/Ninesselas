import { fotosManos } from './../../../models/fotosManos';
import { fotosTatuajes } from './../../../models/fotosTatuajes';
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



@Component({
  selector: 'app-figuracion-edit',
  templateUrl: './figuracion-edit.component.html',
  styleUrls: ['./figuracion-edit.component.css']
})
export class FiguracionEditComponent implements OnInit {


  childForm: FormGroup;
  submitted = false;

  isavailable = false;

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

  //selected
  usuario: Usuario = new Usuario();
  usuarioEdit: Usuario = new Usuario();
  etniaSelect: etnia = new etnia();
  baileSelect: bailarin = new bailarin();
  estilosBaileSelect: estilosBaile = new estilosBaile();
  cantanteSelect: cantante = new cantante();
  estilosCantoSelect: estilosCanto = new estilosCanto();
  habilidadessSelect: habilidades = new habilidades();
  idiomasSelect: idiomas = new idiomas();
  deportistaSelect: deportista = new deportista();
  deporteSelect: deportes = new deportes();
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

  setearDataForm() {
    this.childForm = this.formBuilder.group({

      /****fin variables nuevas */
      username: [''],
      nombres: [''],
      apellidos: [''],
      sexo: [''],
      // bilingue: [''],
      telefono: [''],
      acento: [''],
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
    this.childForm.controls.apellidos.setValue(this.usuario.apellidos);
    this.childForm.controls.sexo.setValue(this.usuario.sexo);
    this.childForm.controls.telefono.setValue(this.usuario.telefono);
    this.childForm.controls.acento.setValue(this.usuario.acento);
    this.childForm.controls.fechaNacimiento.setValue(this.usuario.fechaNacimiento);
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
    this.childForm.controls.colorCoche.setValue(this.usuario.cocheList[0].colorCoche);
    this.childForm.controls.modeloCoche.setValue(this.usuario.cocheList[0].modeloCoche);
    this.childForm.controls.colorMoto.setValue(this.usuario.motoList[0].colorMoto);
    this.childForm.controls.modeloMoto.setValue(this.usuario.motoList[0].modeloMoto);
    this.childForm.controls.numeroDNI.setValue(this.usuario.dniUser);
    this.childForm.controls.numeroSeguridadSocial.setValue(this.usuario.numeroSeguroSocial);
  }

  pasarEntidadesSelect() {
    this.etniaSelect = this.usuario.idEtnia;
    this.deportistaSelect = this.usuario.idDeportista;
    this.deporteSelect = this.usuario.deporteList[0];
    this.baileSelect = this.usuario.idBailarin;
    this.estilosBaileSelect = this.usuario.estiloBaileList[0];
    this.cantanteSelect = this.usuario.idCantante;
    this.estilosCantoSelect = this.usuario.estilosCantoList[0];
    this.habilidadessSelect = this.usuario.habilidadesList[0];
    this.idiomasSelect = this.usuario.idiomasList[0];
  }

  pasarUrlPaths() {
    this.urlAvatar = this.usuario.avatar;
    this.urlCuerpoEntero = '';
    this.urlArtistico = '';

    this.urlMoto = this.usuario.motoList[0].fotoMoto;
    this.urlCoche = this.usuario.cocheList[0].fotoCoche;
    this.urlTatuajes = this.usuario.fotosTatuajesList[0].urlFotoTatuaje;
    this.urlManos = this.usuario.fotosManosList[0].urlFotoMano;
  }

  llenarCombos() {

    //llenado de etnias
    this.authService.finByIdUsuario(localStorage.getItem('figuracionedit'))
      .pipe().subscribe(res => {
        this.usuario = res;
        this.pasarEntidadesSelect();
        this.pasarUrlPaths();
        this.pasarDatosForm();
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
    this.authService.finByIdMusico(1)
      .subscribe(resp => {
        this.musico = resp;
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

  actualizarCoche(idCoche) {
    const newChild = this.childForm.value;
    let coche = {
      "idCoche": idCoche,
      "colorCoche": newChild.colorCoche,
      "fotoCoche": this.urlCoche,
      "modeloCoche": newChild.modeloCoche
    };
    this.authService.editCoche(coche).subscribe(
      resTalla => {
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
      resTalla => {
        console.log('moto actualizada');
      },
      (err) => {
        console.log(JSON.stringify(err));
      });
  }

  actualizarTatuajes(idTatuaje) {
    const newChild = this.childForm.value;
    let tataje = {
      "idFotoTatuaje": idTatuaje,
      "fechaCargaTatuaje": new Date(),
      "nombreFotoTatuaje": this.fileTatuajes.name,
      "urlFotoTatuaje": this.urlTatuajes
    };
    this.authService.editTatuajes(tataje).subscribe(
      resTalla => {
        console.log('tatuaje actualizada');
      },
      (err) => {
        console.log(JSON.stringify(err));
      });
  }

  actualizarManos(idManos) {
    const newChild = this.childForm.value;
    let manos = {
      "idFotoMano": idManos,
      "fechaCargaMano": new Date(),
      "nombreFotoMano": this.fileManos.name,
      "urlFotoMano": this.urlManos
    };
    this.authService.editManos(manos).subscribe(
      resTalla => {
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
      acento: newChild.acento,
      altura: newChild.altura,
      apellidos: newChild.apellidos,
      bilingue: '',
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
      dniUser: '',
      email: newChild.email,
      fechaNacimiento: newChild.fechaNacimiento,
      libroFamilia: '',
      localidad: newChild.localidad,
      nacionalidad: newChild.nacionalidad,
      nombreArtistico: '',
      nombreCompleto: '',
      nombres: newChild.nombres,
      numeroSeguroSocial: newChild.numeroSeguridadSocial,
      observaciones: '',
      password: this.usuario.password,
      pathDniMadre: '',
      pathDniPadre: '',
      pathDniUser: '',
      pathDniRepresentante: '',
      pathSeguroSocial: '',
      provincia: newChild.provincia,
      sexo: newChild.sexo,
      telefono: newChild.telefono,
      telefonoMadre: newChild.telefonomother,
      telefonoPadre: newChild.telefonofather,
      lugarNacimiento: newChild.placebirth,
      edad: 0,
      actor: 'NO',
      username: newChild.username,
      videobook: 'N/A',
      instrumentoList: [],
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
        idType: this.usuario.idType.idType,
        description: this.usuario.idType.description,
        nombres: this.usuario.idType.nombres
      },
      idDeportista: this.deportistaSelect,
      idMusico: this.musico,
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
        localStorage.removeItem('figuracionedit');

        this.actualizarTalla(this.usuario.idUser, res.tallasList[0].idTalla);
        this.actualizarCoche(this.usuario.cocheList[0].idCoche);
        this.actualizarMoto(this.usuario.motoList[0].idMoto);

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



