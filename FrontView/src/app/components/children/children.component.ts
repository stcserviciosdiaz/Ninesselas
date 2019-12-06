import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl, FormGroupDirective, NgForm} from '@angular/forms';
import { AuthService } from '../../Services/auth.service';
import {Router} from '@angular/router';
import { ErrorStateMatcher } from '@angular/material';

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

  idiomasHablados : string[] = ['Frances', 'Alemén', 'Catalán', 'valenciano'];
  habilidades : string[] = ['Skater', 'Skater Acuático', 'Pompas Jabón', 'Presentador', 'Magia', 'Surf', 'Buceo', 'Surf', 'Cómico', 'Motocross', 'Mimo', 'Puenting', 'Sky', 'Parapente', 'Ciclismo BMX', 'Parkour snowboarding', 'Sombras chinescas']
  cantos : string[] = ['Profesional','No Profesional'];
  musicos : string[] = ['Profesional','No Profesional'];
  bailes : string[] = ['Profesional','No Profesional'];
  edad = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16];
  deportes : string [] = ['Tenis','Esgrima','Tiro con arco','Polo','Golf','Boxeo','Voleibol','Baloncesto','Montar a caballo','Natación','Padel','Artes marciales']
  flamenco : string[] = ['Lirico','Pop', 'Rock', 'Rap', 'Heavy Metal', 'Reggae', 'Salsa', 'Pop latino', 'Blues', 'Country', 'Dance', 'Tecno', 'Punk', 'Hip Hop', 'Soul', 'Electro Pop', 'Otros'];
  instrumentos : string[] = ['Piano','Bateria','Guitarra española', 'Guitarra electrica', 'Bajo', 'Bandurria', 'Violin', 'Violonchero', 'Bombo', 'Castañuelas', 'Trombon', 'Trompeta', 'Cantante', 'Otros']
  estilobailes : string[] = ['Cumbia', 'Salsa', 'Tango', 'Hiphop', 'Chachacha', 'Pasodoble', 'Samba', 'Merengue', 'Breakdance', 'Funky', 'Pole Dance', 'Ballet clasico', 'Claque', 'Flamenco', 'sevillanas', 'Contemporaneo', 'Otros']

  childForm: FormGroup;
  submitted = false;

  avatarFile: File = null;
  familyBookFile: File = null;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    
  }

  ngOnInit() {
    this.childForm = this.formBuilder.group({
      username: ['', Validators.required],
      nombres: [null, [Validators.required, Validators.minLength(5)]],
      acceptTerms: [false, Validators.requiredTrue],
      nombreArtistico: [''],
      apellidos: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['',Validators.required],
      sexo: [''],
      estilobailes: [''],
      bailes:[''],
      edad: [''],
      codpostal: [''],
      musicos: [''],
      telefono: [''],
      telefonofather: [''],
      telefonomother: [''],
      fechaNacimiento: [''],
      nacionalidad: [null, [Validators.required]],
      acento: [''],
      tallaPantalon: [''],
      tallaCamisa: [''],
      tallaChaqueta: [''],
      localidad: [''],
      provincia: [''],
      pie: [''],
      cantos: [''],
      habilidades: [''],
      idiomasHablados: [''],
      altura: [''],
      instrumentos : [''],
      colorPiel: [''],
      colorPelo: [''],
      colorOjos: [''],
      observaciones: [''],
      numeroDNI: [''],
      numeroSeguridadSocial: [''],
      numeroDNIPadre: [''],
      numeroDNIMadre: [''],
      numeroDNIRepresentante: [''],
      ultimosTrabajos: [''],
      avatar: [''],
      libroFamilia: [''],
    }

    , {
      validator: MustMatch('password', 'confirmPassword')
    });

  }

  onAvatarSelected(event) {
    this.avatarFile = event.target.files[0] as File;
  }

  onFamilyBookSelected(event) {
    this.familyBookFile = event.target.files[0] as File;
  }

  signupChild() {
    alert('SUCCESS!!');
    this.submitted = true;
    if (this.childForm.invalid) {
      return;
    }
    
    const newChild = this.childForm.value;
    alert('Companía a registrar: ' + JSON.stringify(newChild))
    this.authService.signup(newChild).subscribe(
      res => {
        localStorage.setItem('token', res.token);
        //console.log('Cuenta de Niño creada exitosamente');
        this.router.navigate(['/homeuser']);
      },
      (err) => {
        console.log(JSON.stringify(err));
      });
  }

}
