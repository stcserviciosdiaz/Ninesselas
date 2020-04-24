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
import { coche } from 'src/app/models/coche';
import { moto } from 'src/app/models/moto';
import { fotosManos } from 'src/app/models/fotosManos';
import { fotosTatuajes } from 'src/app/models/fotosTatuajes';




@Component({
  selector: 'app-actor-edit',
  templateUrl: './actor-edit.component.html',
  styleUrls: ['./actor-edit.component.css']
})
export class ActorEditComponent implements OnInit {
  childForm: FormGroup;
  submitted = true;
  isavailable = false;
  date;
  tamanioFotos = 4;//MB
  LinktattoSelect;
  WorkingSelect;
  hide = true;

  tattos: string[] = ['Si', 'No'];
  Models: string[] = ['Si', 'No'];



  /**URL IMAGENES FIREBASE **/
  obsAvatar: Observable<string>;
  obsFotoCuerpo: Observable<string>;
  obsDniA: Observable<string>;
  obsDniB: Observable<string>;
  obsSeguroSocial: Observable<string>;

  obsCoches: Observable<string>[] = [];
  obsMotos: Observable<string>[] = [];
  obsTatuajes: Observable<string>[] = [];
  obsManos: Observable<string>[] = [];


  /***PREVIEW FOTOS */
  previewAvatar: any = null;
  previewCuerpo: any = null;
  previewDNIA: any = null;
  previewDNIB: any = null;
  previewSeguroSocial: any = null;


  obsFotoArtistico: Observable<string>;



  /**VAriables FILES para fotos */
  avatarFile: File = null;
  fileCuerpoEntero: File = null;
  fileArtistico: File = null;
  fileCoche: File = null;
  fileMoto: File = null;
  fileTatuajes: File = null;
  fileManos: File = null;

  fileDNIA: File = null;
  fileDNIB: File = null;
  fileSeguroSocial: File = null;

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

  urlsTatuajes = [];
  urlsManos = [];
  urlsCoches = [];
  urlsMotos = [];

  tatuajeFileList: File[] = [];
  manosFileList: File[] = [];
  cochesFileList: File[] = [];
  motosFileList: File[] = [];

  listCoches: coche[] = [];
  listMotos: moto[] = [];
  listManos: fotosManos[] = [];
  listTatuajes: fotosTatuajes[] = [];
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
  deportistaSelect: deportista = new deportista();
  cantanteSelect: cantante = new cantante();

  estilosBaileSelect: estilosBaile[] = [];
  estilosCantoSelect: estilosCanto[] = [];
  habilidadessSelect: habilidades[] = [];
  idiomasSelect: idiomas[] = [];
  deporteSelect: deportes[] = [];
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

  goTop() {
    var elmnt = document.getElementById("divInicial");
    elmnt.scrollIntoView({ behavior: "smooth", block: "start" });
  }



  ngOnDestroy(): void {
    localStorage.removeItem('actoredit');

  }

  serializedDate: any;
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


        //this.date = new FormControl((new Date(this.usuario.fechaNacimiento)).toISOString());


        this.pasarEntidadesSelect();
        this.pasarUrlPaths();
        this.pasarDatosForm();
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
    this.authService.finByIdMusico(1)
      .subscribe(resp => {
        this.musico = resp;
      });

  }

  setearDataForm() {
    this.childForm = this.formBuilder.group({

      /****fin variables nuevas */
      username: [''],
      nombres: [''],
      apellidos: [''],
      sexo: [''],

      nrocuenta: [''],
      bilingue: [''],

      utTeatro: [''],
      utCine: [''],
      utFiccion: [''],
      utPublicidad: [''],

      videobook: [''],
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
      acceptTerms: [true, Validators.requiredTrue]
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
    this.childForm.controls.videobook.setValue(this.usuario.videobook);
    //this.childForm.controls.colorCoche.setValue(this.usuario.cocheList[0].colorCoche);
    //this.childForm.controls.modeloCoche.setValue(this.usuario.cocheList[0].modeloCoche);
    //this.childForm.controls.colorMoto.setValue(this.usuario.motoList[0].colorMoto);
    //this.childForm.controls.modeloMoto.setValue(this.usuario.motoList[0].modeloMoto);
    this.childForm.controls.numeroDNI.setValue(this.usuario.dniUser);
    this.childForm.controls.numeroSeguridadSocial.setValue(this.usuario.numeroSeguroSocial);
    this.childForm.controls.bilingue.setValue(this.usuario.bilingue);
    this.childForm.controls.nrocuenta.setValue(this.usuario.nrocuenta);
    this.childForm.controls.observaciones.setValue(this.usuario.observaciones);
  
    this.childForm.controls.utTeatro.setValue(this.usuario.ultimosTrabajosList[0].nombreUltimoTrabajo);
    this.childForm.controls.utCine.setValue(this.usuario.ultimosTrabajosList[0].nombreUltimoTrabajo);
    this.childForm.controls.utFiccion.setValue(this.usuario.ultimosTrabajosList[0].nombreUltimoTrabajo);
    this.childForm.controls.utPublicidad.setValue(this.usuario.ultimosTrabajosList[0].nombreUltimoTrabajo);
    
  }

  pasarEntidadesSelect() {
    this.etniaSelect = this.usuario.idEtnia;
    this.deportistaSelect = this.usuario.idDeportista;
    this.deporteSelect = this.usuario.deporteList;
    this.baileSelect = this.usuario.idBailarin;
    this.estilosBaileSelect = this.usuario.estiloBaileList;
    this.cantanteSelect = this.usuario.idCantante;
    this.estilosCantoSelect = this.usuario.estilosCantoList;
    this.habilidadessSelect = this.usuario.habilidadesList;
    this.idiomasSelect = this.usuario.idiomasList;
  }

  pasarFotos() {
    /**AVATAR */

    let filePath: any;
    if (this.usuario.avatar !== null) {
      filePath = this.usuario.avatar;
    } else { filePath = 'admin/9999999999/image-not-found.png'; }

    let ref = this.storage.ref(filePath);
    ref.getDownloadURL().subscribe(resp => {
      this.obsAvatar = resp;
    });

    /**FOTO CUERPO ENTERO */
    if (this.usuario.fotoCuerpo !== null) {
      filePath = this.usuario.fotoCuerpo;
    } else { filePath = 'admin/9999999999/image-not-found.png'; }

    ref = this.storage.ref(filePath);
    ref.getDownloadURL().subscribe(resp => {
      this.obsFotoCuerpo = resp;
    });

    /**FOTO DNI LADO A */
    if (this.usuario.pathDniUser !== null) {
      filePath = this.usuario.pathDniUser;
    } else { filePath = 'admin/9999999999/image-not-found.png'; }

    ref = this.storage.ref(filePath);
    ref.getDownloadURL().subscribe(resp => {
      this.obsDniA = resp;
    });

    /**FOTO DNI LADO B */
    if (this.usuario.pathDniUserB !== null) {
      filePath = this.usuario.pathDniUserB;
    } else { filePath = 'admin/9999999999/image-not-found.png'; }

    ref = this.storage.ref(filePath);
    ref.getDownloadURL().subscribe(resp => {
      this.obsDniB = resp;
    });

    /**FOTO SEGURIDAD SOCIAL */
    if (this.usuario.pathSeguroSocial !== null) {
      filePath = this.usuario.pathSeguroSocial;
    } else { filePath = 'admin/9999999999/image-not-found.png'; }

    ref = this.storage.ref(filePath);
    ref.getDownloadURL().subscribe(resp => {
      this.obsSeguroSocial = resp;
    });

    /**FOTO PROFESIONAL */
    /*if (this.usuario.fotoProfesional !== null) {
      filePath = this.usuario.fotoProfesional;
    } else { filePath = 'admin/9999999999/no-moto.jpg'; }

    ref = this.storage.ref(filePath);
    this.obsFotoArtistico = ref.getDownloadURL();
    ref.getDownloadURL().subscribe(resp => {
      this.obsFotoArtistico = resp;
    });*/

    /**FOTO DE MOTO */
    this.listMotos = this.usuario.motoList;
    for (var x = 0; x < this.listMotos.length; x++) {
      this.verImagenFB(this.listMotos[x].fotoMoto, x, 1);
    }

    /**FOTO DE COCHE */
    this.listCoches = this.usuario.cocheList;
    for (var x = 0; x < this.listCoches.length; x++) {
      this.verImagenFB(this.listCoches[x].fotoCoche, x, 2);
    }

    /**FOTO DE TATUAJES */
    this.listTatuajes = this.usuario.fotosTatuajesList;
    if (this.listTatuajes.some) { this.LinktattoSelect = 'Si'; } else { this.LinktattoSelect = 'No'; }
    for (var x = 0; x < this.listTatuajes.length; x++) {
      this.verImagenFB(this.listTatuajes[x].urlFotoTatuaje, x, 3);
    }

    /**FOTO DE MANOS */
    this.listManos = this.usuario.fotosManosList;
    if (this.listManos.some) { this.WorkingSelect = 'Si'; } else { this.WorkingSelect = 'No'; }
    for (var x = 0; x < this.listManos.length; x++) {
      this.verImagenFB(this.listManos[x].urlFotoMano, x, 4);
    }

  }

  verImagenFB(filePath, index, tipoFoto) {
    let ref = this.storage.ref(filePath);
    ref.getDownloadURL().subscribe(resp => {

      switch (tipoFoto) {
        case 1:
          this.listMotos[index].fotoMoto = resp;
          break;
        case 2:
          this.listCoches[index].fotoCoche = resp;
          break;
        case 3:
          this.listTatuajes[index].urlFotoTatuaje = resp;
          break;
        case 4:
          this.listManos[index].urlFotoMano = resp;
          break;

        default:
          break;
      }


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

  /**Upload avatar */
  onFileAvatarSelected(event) {
    let file: File = event.target.files[0] as File;
    this.avatarFile = this.verificaTamanioTypeFile(file);
    this.verAvatar();
  }

  deleteAvatar() {
    this.avatarFile = null;
    this.previewAvatar = "";
  }

  verAvatar() {
    // Show preview
    var mimeType = this.avatarFile.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    var reader = new FileReader();
    reader.readAsDataURL(this.avatarFile);
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

  /**Upload foto artistica */
  onFileArtisticoSelected(event) {
    this.fileArtistico = event.target.files[0] as File;
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
            let moto = {
              idMoto: 0,
              colorMoto: '',
              fotoMoto: event1.target.result,
              modeloMoto: '',
            };
            this.listMotos.push(moto);
          }
          reader.readAsDataURL(event.target.files[i]);
        }
      }
    }
  }

  aceptarMoto(indexMotoFile: any) {
    const object = this.childForm.value;
    let moto = {
      idMoto: this.listMotos[indexMotoFile].idMoto,
      colorMoto: object.colorMoto,
      fotoMoto: this.listMotos[indexMotoFile].fotoMoto,
      modeloMoto: object.modeloMoto,
    };

    this.listMotos[indexMotoFile] = moto;


  }


  verNombreMotoPage(indexPage: any): string {
    let nombreImagen = this.listMotos[indexPage].modeloMoto;
    return nombreImagen;
  }

  indexDeleteMoto: any;
  idDeleteMoto: any;
  confirmDeleteMoto(index: any) {
    this.indexDeleteMoto = index;
    this.idDeleteMoto = this.listMotos[index].idMoto;
  }

  deleteMotoPage() {
    if (this.idDeleteMoto !== 0) {
      this.authService.deleteMoto(this.idDeleteMoto)
        .subscribe(resp => {
        });
    }
    this.urlsMotos.splice(this.indexDeleteMoto, 1);
    this.motosFileList.splice(this.indexDeleteMoto, 1);
    this.listMotos.splice(this.indexDeleteMoto, 1);

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
            this.urlsCoches.push(event1.target.result);
            this.cochesFileList.push(event.target.files[i]);
            let coche = {
              idCoche: 0,
              colorCoche: '',
              fotoCoche: event1.target.result,
              modeloCoche: '',
            };
            this.listCoches.push(coche);
          }
          reader.readAsDataURL(event.target.files[i]);
        }
      }
    }
  }

  verNombreCochePage(indexPage: any): string {
    let nombreImagen = this.listCoches[indexPage].idCoche;
    return nombreImagen;
  }

  indexDeleteCoche: any;
  idDeleteCoche: any;
  confirmDeleteCoche(index: any) {
    this.indexDeleteCoche = index;
    this.idDeleteCoche = this.listCoches[index].idCoche;
  }

  deleteCochePage() {
    if (this.idDeleteCoche !== 0) {
      this.authService.deleteCoche(this.idDeleteCoche)
        .subscribe(resp => {
        });
    }

    this.urlsCoches.splice(this.indexDeleteCoche, 1);
    this.cochesFileList.splice(this.indexDeleteCoche, 1);
    this.listCoches.splice(this.indexDeleteCoche, 1);

  }



  aceptarCoche(indexCocheFile: any) {
    const object = this.childForm.value;

    let coche = {
      idCoche: this.listCoches[indexCocheFile].idCoche,
      colorCoche: object.colorCoche,
      fotoCoche: this.listCoches[indexCocheFile].fotoCoche,
      modeloCoche: object.modeloCoche,
    };

    this.listCoches[indexCocheFile] = coche; console.log('DATOS COCHE ARRAY: ' + JSON.stringify(this.listCoches));

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
            let tatuaje = {
              idFotoTatuaje: 0,
              fechaCargaTatuaje: new Date(),
              nombreFotoTatuaje: event.target.files[i].name,
              urlFotoTatuaje: event1.target.result
            };
            this.listTatuajes.push(tatuaje);
          }
          reader.readAsDataURL(event.target.files[i]);
        }
      }
    }
  }

  verNombreTatuajePage(indexPage: any): string {
    let nombreImagen = this.listTatuajes[indexPage].nombreFotoTatuaje;
    return nombreImagen;
  }

  indexDeleteTatuaje: any;
  idDeleteTatuaje: any;
  confirmDeleteTatuaje(index: any) {
    this.indexDeleteTatuaje = index;
    this.idDeleteTatuaje = this.listTatuajes[index].idFotoTatuaje;
  }

  deleteTatuajePage() {
    if (this.idDeleteTatuaje !== 0) {
      this.authService.deleteTatuaje(this.idDeleteTatuaje)
        .subscribe(resp => {
        });
    }
    this.urlsTatuajes.splice(this.indexDeleteTatuaje, 1);
    this.tatuajeFileList.splice(this.indexDeleteTatuaje, 1);
    this.listTatuajes.splice(this.indexDeleteTatuaje, 1);
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
            let manos = {
              idFotoMano: 0,
              fechaCargaMano: new Date(),
              nombreFotoMano: event.target.files[i].name,
              urlFotoMano: event1.target.result
            };
            this.listManos.push(manos);
          }
          reader.readAsDataURL(event.target.files[i]);
        }
      }
    }
  }

  verNombreManoPage(indexPage: any): string {
    let nombreImagen = this.listManos[indexPage].nombreFotoMano;
    return nombreImagen;
  }

  indexDeleteManos: any;
  idDeleteManos: any;
  confirmDeleteManos(index: any) {
    this.indexDeleteManos = index;
    this.idDeleteManos = this.listManos[index].idFotoMano;
  }

  deleteManoPage() {
    if (this.idDeleteManos !== 0) {
      this.authService.deleteManos(this.idDeleteManos)
        .subscribe(resp => { });
    }
    this.urlsManos.splice(this.indexDeleteManos, 1);
    this.manosFileList.splice(this.indexDeleteManos, 1);
    this.listManos.splice(this.indexDeleteManos, 1);
  }

  pasarUrlPaths() {
    this.urlAvatar = this.usuario.avatar;
    this.urlCuerpoEntero = this.usuario.fotoCuerpo;
    this.urlArtistico = this.usuario.fotoProfesional;
    this.urlUsuarioA = this.usuario.pathDniUser;
    this.urlUsuarioB = this.usuario.pathDniUserB;
    this.urlSeguroSocial = this.usuario.pathSeguroSocial;

    /*
    this.urlMoto = this.usuario.motoList[0].fotoMoto;
    this.urlCoche = this.usuario.cocheList[0].fotoCoche;
    this.urlTatuajes = this.usuario.fotosTatuajesList[0].urlFotoTatuaje;
    this.urlManos = this.usuario.fotosManosList[0].urlFotoMano;
    */
  }

  onChangeDate($event) {
    let date1 = new Date($event.value);
    this.date = new Date();
    this.date.setDate(date1.getUTCDate());
    this.date.setMonth(date1.getUTCMonth());
    this.date.setFullYear(date1.getUTCFullYear());
  }

  isChecked(idItem, id): boolean {
    if (id === 1) {
      const valor = this.deporteSelect.find(x => x.nombreDeporte === idItem);
      if (valor)
        return true;
      else return false;
    } else if (id === 2) {
      const valor = this.estilosBaileSelect.find(x => x.nombreBaile === idItem);
      if (valor)
        return true;
      else return false;
    } else if (id === 3) {
      const valor = this.estilosCantoSelect.find(x => x.nombreEstiloCanto === idItem);
      if (valor)
        return true;
      else return false;
    } else if (id === 4) {
      const valor = this.habilidadessSelect.find(x => x.nombreHabilidad === idItem);
      if (valor)
        return true;
      else return false;
    } else if (id === 5) {
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
        this.estilosBaileSelect.push(item);
      } else {
        const index: number = this.estilosBaileSelect.indexOf(item);
        this.estilosBaileSelect.splice(index, 1);
      }
    } else if (id === 3) {
      if ($event.checked) {
        this.estilosCantoSelect.push(item);
      } else {
        const index: number = this.estilosCantoSelect.indexOf(item);
        this.estilosCantoSelect.splice(index, 1);
      }
    } else if (id === 4) {
      if ($event.checked) {
        this.habilidadessSelect.push(item);
      } else {
        const index: number = this.habilidadessSelect.indexOf(item);
        this.habilidadessSelect.splice(index, 1);
      }
    } else if (id === 5) {
      if ($event.checked) {
        this.idiomasSelect.push(item);
      } else {
        const index: number = this.idiomasSelect.indexOf(item);
        this.idiomasSelect.splice(index, 1);
      }
    }

    //MatCheckboxChange {checked,MatCheckbox}
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

  actualizarCoche(idUser) {
    let filesAmount = this.listCoches.length;
    let indexFileCoche = 0;
    for (let i = 0; i < filesAmount; i++) {
      let coche = {
        idCoche: this.listCoches[i].idCoche,
        colorCoche: this.listCoches[i].colorCoche,
        fotoCoche: this.listCoches[i].fotoCoche,
        modeloCoche: this.listCoches[i].modeloCoche,
        idUser: idUser
      }

      if (this.listCoches[i].idCoche === 0) {
        let dnuIser = this.childForm.get('numeroDNI').value;
        let url = 'actor/' + dnuIser + '/coche-' + this.cochesFileList[indexFileCoche].name;
        indexFileCoche++;
        coche.fotoCoche = url;
        /***GUARDE CON SERVICIO */
        this.authService.saveCoche(coche).subscribe(
          resTalla => {
            console.log('info save coche');
          },
          (err) => {
            console.log('error save coche');
          });
      } else {
        /***ACTUALIZA CON SERVICIO */
        this.authService.findByIdCoche(coche.idCoche).subscribe(
          resp => {
            coche.fotoCoche = resp.fotoCoche;
            this.authService.editCoche(coche).subscribe(
              resTalla => {
                console.log('info edit coche');
              },
              (err) => {
                console.log('error edit coche');
              });
          });

      }
    }
  }

  actualizarMoto(idUser) {
    const newChild = this.childForm.value;
    let filesAmount = this.listMotos.length;
    let indexFileMoto = 0;
    for (let i = 0; i < filesAmount; i++) {
      let moto = {
        idMoto: this.listMotos[i].idMoto,
        colorMoto: this.listMotos[i].colorMoto,
        fotoMoto: this.listMotos[i].fotoMoto,
        modeloMoto: this.listMotos[i].modeloMoto,
        idUser: idUser
      }
      if (this.listMotos[i].idMoto === 0) {
        let dnuIser = this.childForm.get('numeroDNI').value;
        let urlMoto = 'actor/' + dnuIser + '/moto-' + this.motosFileList[indexFileMoto].name;
        indexFileMoto++;
        moto.fotoMoto = urlMoto;
        this.authService.saveMoto(moto).subscribe(
          resp => {
            console.log('moto registrada');
          },
          (err) => {
            console.log(JSON.stringify(err));
          });
      }
      else {
        this.authService.findByIdMoto(moto.idMoto).subscribe(
          resp => {
            moto.fotoMoto = resp.fotoMoto;
            this.authService.editMoto(moto).subscribe(
              resp => {
                console.log('moto actualizada');
              },
              (err) => {
                console.log(JSON.stringify(err));
              });
          });
      }
    }
  }

  actualizarTatuajes(idUser) {
    const newChild = this.childForm.value;

    let filesAmount = this.listTatuajes.length;
    let index = 0;
    for (let i = 0; i < filesAmount; i++) {
      let tatuaje = {
        idFotoTatuaje: this.listTatuajes[i].idFotoTatuaje,
        fechaCargaTatuaje: new Date(),
        nombreFotoTatuaje: this.listTatuajes[i].nombreFotoTatuaje,
        urlFotoTatuaje: this.listTatuajes[i].urlFotoTatuaje,
        idUser: idUser
      }

      if (this.listTatuajes[i].idFotoTatuaje === 0) {
        let dnuIser = this.childForm.get('numeroDNI').value;
        let url = 'actor/' + dnuIser + '/tatuajes-' + this.tatuajeFileList[index].name;
        index++;
        tatuaje.urlFotoTatuaje = url;
        this.authService.saveTatuajes(tatuaje).subscribe(
          resTalla => {
            console.log('tatuaje registrado');
          },
          (err) => {
            console.log(JSON.stringify(err));
          });
      }
      else {
        this.authService.findByIdTatuaje(tatuaje.idFotoTatuaje).subscribe(
          resTalla => {
            tatuaje.urlFotoTatuaje = resTalla.urlFotoTatuaje
            this.authService.editTatuajes(tatuaje).subscribe(
              resTalla => {
                console.log('tatuaje actualizada');
              },
              (err) => {
                console.log(JSON.stringify(err));
              });
          });
      }
    }
  }

  actualizarManos(idUser) {
    const newChild = this.childForm.value;
    let filesAmount = this.listManos.length;
    let index = 0;
    for (let i = 0; i < filesAmount; i++) {
      let manos = {
        idFotoMano: this.listManos[i].idFotoMano,
        fechaCargaMano: new Date(),
        nombreFotoMano: this.listManos[i].nombreFotoMano,
        urlFotoMano: this.listManos[i].urlFotoMano,
        idUser: idUser
      }

      if (this.listManos[i].idFotoMano === 0) {
        let dnuIser = this.childForm.get('numeroDNI').value;
        let url = 'actor/' + dnuIser + '/manos-' + this.manosFileList[index].name;
        index++;
        manos.urlFotoMano = url;
        this.authService.saveManos(manos).subscribe(
          resTalla => {
            console.log('mano regigstrada');
          },
          (err) => {
            console.log(JSON.stringify(err));
          });
      } else {
        this.authService.findByIdManos(manos.idFotoMano).subscribe(
          resTalla => {
            manos.urlFotoMano = resTalla.urlFotoMano;
            this.authService.editManos(manos).subscribe(
              resTalla => {
                console.log('mano actualizada');
              },
              (err) => {
                console.log(JSON.stringify(err));
              });
          });
      }
    }
  }

  pasarDatosFormUsuario() {

    const newChild = this.childForm.value;
    this.usuarioEdit = {
      idUser: this.usuario.idUser,
      avatar: this.urlAvatar,
      fotoCuerpo: this.urlCuerpoEntero,
      fotoProfesional: this.urlArtistico,
      acento: newChild.acento,
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
      nombreArtistico: '',
      nombreCompleto: '',
      nombres: newChild.nombres,
      numeroSeguroSocial: newChild.numeroSeguridadSocial,
      observaciones: newChild.observaciones,
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
      actor: 'NO',
      username: newChild.username,
      videobook: 'N/A',
      instrumentoList: [],
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
      idMusico: this.musico,
      motoList: [],
      cocheList: [],
      fotosTatuajesList: [],
      fotosManosList: []
    };

  }

  actualizarFotos(idUser) {
    this.actualizarCoche(idUser);
    this.actualizarMoto(idUser);
    this.actualizarTatuajes(idUser);
    this.actualizarManos(idUser);
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

        this.actualizarTalla(this.usuario.idUser, res.tallasList[0].idTalla);
        this.actualizarFotos(this.usuario.idUser);

        this.ngxSmartModalService.create('EDICION', 'Cuenta actualizada exitosamente ').open();
        this.router.navigate(['/management']);
      },
      (err) => {
        this.ngxSmartModalService.create('confirm', 'Se ha presentado un Error, vuelva a intentarlo y si el problema persiste, contáctenos').open();
        console.log(JSON.stringify(err));
      });
  }



  subirArchivos() {
    /**subir avatar */
    let idUser = this.childForm.get('numeroDNI').value;
    let task: any;
    if (this.avatarFile !== null) {
      this.urlAvatar = 'actor/' + idUser + '/avatar-' + this.avatarFile.name;
      task = this.storage.upload(this.urlAvatar, this.avatarFile);
    }
    /**subir cuerpo entero */
    if (this.fileCuerpoEntero !== null) {
      this.urlCuerpoEntero = 'actor/' + idUser + '/cuerpo-' + this.fileCuerpoEntero.name;
      task = this.storage.upload(this.urlCuerpoEntero, this.fileCuerpoEntero);
    }
    /**subir foto artistica */
    if (this.fileArtistico !== null) {
      this.urlArtistico = 'actor/' + idUser + '/artistico-' + this.fileArtistico.name;
      task = this.storage.upload(this.urlArtistico, this.fileArtistico);
    }

    /**subir foto dnilado A */
    if (this.fileDNIA !== null) {
      this.urlUsuarioA = 'actor/' + idUser + '/dnia-' + this.fileDNIA.name;
      task = this.storage.upload(this.urlUsuarioA, this.fileDNIA);
    }

    /**subir foto dnilado B */
    if (this.fileDNIB !== null) {
      this.urlUsuarioB = 'actor/' + idUser + '/dnib-' + this.fileDNIB.name;
      task = this.storage.upload(this.urlUsuarioB, this.fileDNIB);
    }

    /**subir foto seguridad social */
    if (this.fileSeguroSocial !== null) {
      this.urlSeguroSocial = 'actor/' + idUser + '/segurosocial-' + this.fileSeguroSocial.name;
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
    /**subir moto */
    if (this.motosFileList !== null) {
      var filesAmount = this.motosFileList.length;
      for (let i = 0; i < filesAmount; i++) {
        this.urlMoto = 'actor/' + idUser + '/moto-' + this.motosFileList[i].name;
        task = this.storage.upload(this.urlMoto, this.motosFileList[i]);
      }
    }
    /**subir tatuajes */
    if (this.tatuajeFileList !== null) {
      var filesAmount = this.tatuajeFileList.length;
      for (let i = 0; i < filesAmount; i++) {
        this.urlTatuajes = 'actor/' + idUser + '/tatuajes-' + this.tatuajeFileList[i].name;
        task = this.storage.upload(this.urlTatuajes, this.tatuajeFileList[i]);
      }
    }
    /**subir manos */
    if (this.manosFileList !== null) {
      var filesAmount = this.manosFileList.length;
      for (let i = 0; i < filesAmount; i++) {
        this.urlManos = 'actor/' + idUser + '/manos-' + this.manosFileList[i].name;
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



