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
  uploadPercent: Observable<number>;
  urlImage: Observable<string>;

  /*******variables para combos********/
  etnias: etnia[];
  baile: bailarin[];
  estilosBaile: estilosBaile[];
  cantante: cantante[];
  estilosCanto: estilosCanto[];
  habilidadess: habilidades[];
  idiomas: idiomas[];
  //selected
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
  selectedFile: File = null;
  @Input() inputArray;
  subscriber;
  matcher = new MyErrorStateMatcher();
  bailes = [{ name: 'Profesional', }, { name: 'No Profesional', },];
  cantos = [{ name: 'Profesional', }, { name: 'No Profesional', },];
  etnico: string[] = ['Afro descendiente/Negro', 'Blanco', 'Indígena', 'Mestizo/Moreno', 'Asiático', 'Otro'];
  estilobailes: string[] = ['Cumbia', 'Salsa', 'Tango', 'Hiphop', 'Chachacha', 'Pasodoble', 'Samba', 'Merengue', 'Breakdance', 'Funky', 'Pole Dance', 'Ballet clasico', 'Claque', 'Flamenco', 'sevillanas', 'Contemporaneo', 'Otros']
  estilocantos: string[] = ['Lirico', 'Pop', 'Rock', 'Rap', 'Heavy Metal', 'Reggae', 'Salsa', 'Pop latino', 'Blues', 'Country', 'Dance', 'Tecno', 'Punk', 'Hip Hop', 'Soul', 'Electro Pop', 'Otros'];
  habilidades: string[] = ['Skater', 'Skater Acuático', 'Pompas Jabón', 'Presentador', 'Magia', 'Surf', 'Buceo', 'Surf', 'Cómico', 'Motocross', 'Mimo', 'Puenting', 'Sky', 'Parapente', 'Ciclismo BMX', 'Parkour snowboarding', 'Sombras chinescas', 'Otros']
  idiomasHablados: string[] = ['Gallego', 'Italiano', 'Rumano', 'Frances', 'Alemén', 'Catalán', 'valenciano', 'bilingüe', 'Otros'];
  // @ViewChild(TemplateRef, { static: false }) tpl: TemplateRef<any>;

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
      username: ['', Validators.required],
      acceptTerms: ['', Validators.required],
      habilidades: ['', Validators.required],
      cantos: ['', Validators.required],
      estilocantos: ['', Validators.required],
      placebirth: ['', Validators.required],
      idiomasHablados: ['', Validators.required],
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      localidad: ['', Validators.required],
      provincia: ['', Validators.required],
      bailes: ['', Validators.required],
      estilobailes: ['', Validators.required],
      codpostal: ['', Validators.required],
      direccion: ['', Validators.required],
      sexo: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
      fechaNacimiento: ['', Validators.required],
      nacionalidad: ['', Validators.required],
      acento: ['', Validators.required],
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
      carnetConducir: ['', Validators.required],
      modeloCoche: ['', Validators.required],
      colorCoche: ['', Validators.required],
      fotoCoche: ['', Validators.required],
      modeloMoto: ['', Validators.required],
      colorMoto: ['', Validators.required],
      fotoMoto: ['', Validators.required],
      avatar: ['', Validators.required],
      tattoos: ['', Validators.required],
      manos: ['', Validators.required],
    }
      , {
        validator: MustMatch('password', 'confirmPassword')
      });

  }

  /**Upload foto de perfil */
  onFileSelected(event) {
    this.selectedFile = event.target.files[0] as File;
  }

  uploadAvatar() {
    const id = Math.random().toString(36).substring(2);
    const filePath = 'figuracion/avatar/' + this.selectedFile.name;
    const ref = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, this.selectedFile);
    this.uploadPercent = task.percentageChanges();
    task.snapshotChanges().
      pipe(finalize(() => this.urlImage = ref.getDownloadURL())).
      subscribe();
  }

  registrarActor() {
    this.submitted = true;
    const newUserObject = this.actorForm.value;

    this.usuario = {
      idUser: 0,
      avatar: '',
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

    this.subscriber = this.authService.signup2(this.usuario).subscribe(
      res => {
        localStorage.setItem('token', res.idUser);
        this.ngxSmartModalService.create('confirm', 'Cuenta de Figuración creada exitosamente ' + res.nombres + ' ' + res.apellidos).open();
        // this.subirFotoPerfil()
        this.router.navigate(['/homeuser']);
      },
      (err) => {
        this.ngxSmartModalService.create('confirm', 'Se ha presentado un Error, vuelva a intentarlo y si el problema persiste, contáctenos').open();
        console.log(JSON.stringify(err));
      });
  }



  subirFotoPerfil() {
    const fd = new FormData();
    fd.append('avatar', this.selectedFile, this.selectedFile.name);
    this.authService.uploadAvatar(fd).subscribe(res => {
      console.log(res);
    });
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
