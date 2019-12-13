import {Component, NgModule, Input, OnDestroy, OnInit, ViewChild, TemplateRef} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import { ErrorStateMatcher } from '@angular/material';
import { invalid } from '@angular/compiler/src/render3/view/util';
import { NgxSmartModalService, NgxSmartModalComponent } from 'ngx-smart-modal';
import { AuthService } from '../../Services/auth.service';

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
  etnico: string[] = ['Afro descendiente/Negro','Blanco','Indígena','Mestizo/Moreno','Asiático','Otro'];
  deporte: string[] = ['Profesional','Federado','No Profesional'];
  actor : string[] = ['Si', 'No'];
  bailes : string[] = ['Profesional','No Profesional'];
  musicos : string[] = ['Profesional','No Profesional'];
  cantos : string[] = ['Profesional','No Profesional'];
  idiomasHablados : string[] = ['Gallego','Italiano','Rumano','Frances', 'Alemén', 'Catalán', 'valenciano','bilingüe'];
  habilidades : string[] = ['Skater', 'Skater Acuático', 'Pompas Jabón', 'Presentador', 'Magia', 'Surf', 'Buceo', 'Surf', 'Cómico', 'Motocross', 'Mimo', 'Puenting', 'Sky', 'Parapente', 'Ciclismo BMX', 'Parkour snowboarding', 'Sombras chinescas']
  estilocantos : string[] = ['Lirico','Pop', 'Rock', 'Rap', 'Heavy Metal', 'Reggae', 'Salsa', 'Pop latino', 'Blues', 'Country', 'Dance', 'Tecno', 'Punk', 'Hip Hop', 'Soul', 'Electro Pop', 'Otros'];
  instrumentos : string[] = ['Piano','Bateria','Guitarra española', 'Guitarra electrica', 'Bajo', 'Bandurria', 'Violin', 'Violonchero', 'Bombo', 'Castañuelas', 'Trombon', 'Trompeta', 'Cantante', 'Otros']
  estilobailes : string[] = ['Cumbia', 'Salsa', 'Tango', 'Hiphop', 'Chachacha', 'Pasodoble', 'Samba', 'Merengue', 'Breakdance', 'Funky', 'Pole Dance', 'Ballet clasico', 'Claque', 'Flamenco', 'sevillanas', 'Contemporaneo', 'Otros']
  habdeportes : string [] = ['Tenis','Esgrima','Tiro con arco','Polo','Golf','Boxeo','Voleibol','Baloncesto','Montar a caballo','Natación','Padel','Artes marciales']
  
  @ViewChild (TemplateRef, {static: false}) tpl: TemplateRef <any>;
  constructor(
    private authService: AuthService,
    public ngxSmartModalService: NgxSmartModalService,
    private formBuilder: FormBuilder,
    private router: Router,
    
  ) {
    this.createRegisterForm();
  }

  capturar() {
    var deporte = this.deporte
    if (deporte.indexOf('1') || deporte.indexOf('0')){
      console.log(1, 0);
    }else{
      console.log(0)
    }
  }

  onFileSelected(event) {
    this.selectedFile = event.target.files[0] as File;
  }

  ngOnInit() {
    
  }

  createRegisterForm() {
    this.actorForm = this.formBuilder.group({
      email: ['',[Validators.required,Validators.email,Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      password: ['',[Validators.required,Validators.minLength(6)]],
      confirmPassword: ['',Validators.required],
      acceptTerms: [false, Validators.requiredTrue],
      bailes:[''],
      etnico: [''],
      placebirth:['',Validators.required],
      habilidades:[''],
      username: ['', Validators.required],
      nombres: ['', [Validators.required, Validators.minLength(3)]],
      estilobailes:[''],
      cantos: [''],
      estilocantos:[''],
      instrumentos:[''],
      deporte: [''],
      apellidos: ['',Validators.required],
      nombreArtistico: ['',Validators.required],
      sexo: [''],
      telefono: ['',Validators.required],
      fechaNacimiento: [''],
      nacionalidad: [''],
      localidad: [''],
      videoBook: [''],
      provincia: [''],
      codpostal: [''],
      direccion: [''],
      acento: [''],
      tallaPantalon: [''],
      tallaCamisa: [''],
      tallaChaqueta: [''],
      pie: [''],
      tattoos: [''],
      avatar: [''],
      habdeportes: [''],
      altura: [''],
      musicos:[''],
      colorPiel: [''],
      colorPelo: [''],
      colorOjos: [''],
      numeroDNI: ['',Validators.required],
      numeroSeguridadSocial: ['',Validators.required],
      carnetConducir: [''],
      modeloCoche: [''],
      colorCoche: [''],
      modeloMoto: [''],
      colorMoto: [''],
      ultimosTrabajos: [''],
    }

    , {
      validator: MustMatch('password', 'confirmPassword')
    });

  }

  registrarActor() {
    this.submitted = true;
    if (this.actorForm.invalid) {
      return;
    }
    const newUserObject = this.actorForm.value;
    //alert(JSON.stringify(newUserObject))
    this.authService.signup(newUserObject).subscribe(
      res => {
        this.ngxSmartModalService.create('confirm', 'Se ha registrado exitosamente').open();
        localStorage.setItem('token', res.token);
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
