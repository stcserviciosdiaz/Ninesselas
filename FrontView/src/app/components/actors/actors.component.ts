import { instrumento } from './../../models/instrumentos';
import { musico } from './../../models/musico';
import { deportes } from './../../models/deportes';
import { deportista } from './../../models/deportista';
import { Component, NgModule, Input, OnDestroy, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ErrorStateMatcher } from '@angular/material';
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
  actorForm: FormGroup;
  submitted = false;
  selectedFile: File = null;
  disa = false;
  matcher = new MyErrorStateMatcher();
  etnico: string[] = ['Afro descendiente/Negro', 'Blanco', 'Indígena', 'Mestizo/Moreno', 'Asiático', 'Otro'];
  deporte = [{ name: 'Profesional', }, { name: 'Federado', }, { name: 'No Profesional', },];
  actor = [{ name: 'Si', value: 0 }, { name: 'No', value: 1 }];
  bailes = [{ name: 'Profesional', }, { name: 'No Profesional', },];
  musicos = [{ name: 'Profesional', }, { name: 'No Profesional', },];
  cantos = [{ name: 'Profesional', }, { name: 'No Profesional', },];
  idiomasHablados: string[] = ['Gallego', 'Italiano', 'Rumano', 'Frances', 'Alemén', 'Catalán', 'valenciano', 'bilingüe', 'Otros'];
  habilidades: string[] = ['Skater', 'Skater Acuático', 'Pompas Jabón', 'Presentador', 'Magia', 'Surf', 'Buceo', 'Surf', 'Cómico', 'Motocross', 'Mimo', 'Puenting', 'Sky', 'Parapente', 'Ciclismo BMX', 'Parkour snowboarding', 'Sombras chinescas', 'Otros']
  estilocantos: string[] = ['Lirico', 'Pop', 'Rock', 'Rap', 'Heavy Metal', 'Reggae', 'Salsa', 'Pop latino', 'Blues', 'Country', 'Dance', 'Tecno', 'Punk', 'Hip Hop', 'Soul', 'Electro Pop', 'Otros'];
  instrumentos: string[] = ['Piano', 'Bateria', 'Guitarra española', 'Guitarra electrica', 'Bajo', 'Bandurria', 'Violin', 'Violonchero', 'Bombo', 'Castañuelas', 'Trombon', 'Trompeta', 'Cantante', 'Otros']
  estilobailes: string[] = ['Cumbia', 'Salsa', 'Tango', 'Hiphop', 'Chachacha', 'Pasodoble', 'Samba', 'Merengue', 'Breakdance', 'Funky', 'Pole Dance', 'Ballet clasico', 'Claque', 'Flamenco', 'sevillanas', 'Contemporaneo', 'Otros']
  habdeportes: string[] = ['Tenis', 'Esgrima', 'Tiro con arco', 'Polo', 'Golf', 'Boxeo', 'Voleibol', 'Baloncesto', 'Montar a caballo', 'Natación', 'Padel', 'Artes marciales', 'Otros']

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

  //selected
  etniaSelect;
  usuario: Usuario;
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
    private authService: AuthService,
    public ngxSmartModalService: NgxSmartModalService,
    private formBuilder: FormBuilder,
    private router: Router,

  ) {
    this.createRegisterForm();
  }

  onFileSelected(event) {
    this.selectedFile = event.target.files[0] as File;
  }

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

  createRegisterForm() {
    this.actorForm = this.formBuilder.group({
      /****variables nuevas */

      etnias: ['', Validators.required],
      baile: ['', Validators.required],
      estilosBaile: ['', Validators.required],
      cantante: ['', Validators.required],
      estilosCanto: ['', Validators.required],
      habilidadess: ['', Validators.required],
      idiomas: ['', Validators.required],
      deportista: ['', Validators.required],
      deportes: ['', Validators.required],
      musico: ['', Validators.required],
      instrumentoss: ['', Validators.required],
      /****fin variables nuevas */
      email: ['', [Validators.required, Validators.email, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      acceptTerms: [false, Validators.requiredTrue],
      bailes: ['', Validators.required],
      etnico: ['', Validators.required],
      placebirth: ['', Validators.required],
      habilidades: ['', Validators.required],
      username: ['', Validators.required],
      nombres: ['', [Validators.required, Validators.minLength(3)]],
      estilobailes: ['', Validators.required],
      cantos: ['', Validators.required],
      estilocantos: ['', Validators.required],
      instrumentos: ['', Validators.required],
      deporte: ['', Validators.required],
      apellidos: ['', Validators.required],
      nombreArtistico: ['', Validators.required],
      sexo: ['', Validators.required],
      telefono: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      nacionalidad: ['', Validators.required],
      localidad: ['', Validators.required],
      videoBook: ['', Validators.required],
      provincia: ['', Validators.required],
      codpostal: ['', Validators.required],
      direccion: ['', Validators.required],
      acento: ['', Validators.required],
      tallaPantalon: ['', Validators.required],
      tallaCamisa: ['', Validators.required],
      tallaChaqueta: ['', Validators.required],
      pie: ['', Validators.required],
      tattoos: ['', Validators.required],
      avatar: ['', Validators.required],
      habdeportes: ['', Validators.required],
      altura: ['', Validators.required],
      musicos: ['', Validators.required],
      colorPiel: ['', Validators.required],
      colorPelo: ['', Validators.required],
      colorOjos: ['', Validators.required],
      numeroDNI: ['', Validators.required],
      numeroSeguridadSocial: ['', Validators.required],
      carnetConducir: ['', Validators.required],
      modeloCoche: ['', Validators.required],
      colorCoche: ['', Validators.required],
      modeloMoto: ['', Validators.required],
      colorMoto: ['', Validators.required],
      ultimosTrabajos: ['', Validators.required],
    }

      , {
        validator: MustMatch('password', 'confirmPassword')
      });

  }

  registrarActor() {
    console.log('DATOS DE ETNIA' + this.etniaSelect.idEtnia);
    this.submitted = true;
    /*if (this.actorForm.invalid) {
      return;
    }*/
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

    //alert(JSON.stringify(newUserObject))
    console.info(this.usuario);
    this.authService.signup2(this.usuario).subscribe(
      res => {
        this.ngxSmartModalService.create('confirm', 'Se ha registrado exitosamente' + this.usuario.nombreCompleto).open();
        localStorage.setItem('token', res.idUser);
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
