import {Component, NgModule, Input, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import { AuthService } from '../../Services/auth.service';
import {Router} from '@angular/router';
import { ErrorStateMatcher } from '@angular/material';
import { invalid } from '@angular/compiler/src/render3/view/util';

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
  

  constructor(
    private authService: AuthService,
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
      email: ['',[Validators.required,Validators.email]],
      password: ['',[Validators.required,Validators.minLength(5)]],
      confirmPassword: ['',Validators.required],
      acceptTerms: [false, Validators.requiredTrue],
      bailes:[''],
      etnico: [''],
      placebirth:['',Validators.required],
      habilidades:[''],
      username: ['', Validators.required],
      nombres: ['', Validators.required],
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
    });
  }

  
 

  registrarActor() {
    this.submitted = true;
    if (this.actorForm.invalid) {
      return;
    }
    const newUserObject = this.actorForm.value;
    alert(JSON.stringify(newUserObject))
    this.authService.signup(newUserObject).subscribe(
      res => {
        localStorage.setItem('token', res.token);
        //console.log('Cuenta de Actor/Modelo creada exitosamente');
        // this.subirFotoPerfil();
        this.router.navigate(['/homeuser']);
      },
      (err) => {
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

  

 /*  onCheckLanguage(event) {
    if (event.target.checked) {
      for (const idioma of this.idiomasHablados) {
        if (idioma.nombreIdioma === event.target.value) {
          idioma.isChecked = true;
        }
      }
    } else {
      // find the unselected element
      for (const idioma of this.idiomasHablados) {
        if (idioma.nombreIdioma === event.target.value) {
          idioma.isChecked = false;
        }
      }
    }
  } */

}
