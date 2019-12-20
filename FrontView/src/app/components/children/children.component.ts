import { Component, Input, OnDestroy, OnInit, ViewChild, TemplateRef } from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl, FormGroupDirective, NgForm} from '@angular/forms';
import { NgxSmartModalService, NgxSmartModalComponent } from 'ngx-smart-modal';
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

  idiomasHablados : string[] = ['Gallego','Italiano','Rumano','Frances', 'Alemén', 'Catalán', 'valenciano','bilingüe'];
  habilidades : string[] = ['Skater', 'Skater Acuático', 'Pompas Jabón', 'Presentador', 'Magia', 'Surf', 'Buceo', 'Surf', 'Cómico', 'Motocross', 'Mimo', 'Puenting', 'Sky', 'Parapente', 'Ciclismo BMX', 'Parkour snowboarding', 'Sombras chinescas']
  cantos : string[] = ['Profesional','No Profesional'];
  musicos : string[] = ['Profesional','No Profesional'];
  bailes : string[] = ['Profesional','No Profesional'];
  actor : string[] = ['Si', 'No'];
  etnico: string[] = ['Afro descendiente/Negro','Blanco','Indígena','Mestizo/Moreno','Asiático','Otro'];
  edad = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16];
  deporte : string[] = ['Profesional','No Profesional','Federado'];
  habdeportes : string [] = ['Tenis','Esgrima','Tiro con arco','Polo','Golf','Boxeo','Voleibol','Baloncesto','Montar a caballo','Natación','Padel','Artes marciales']
  estilocantos : string[] = ['Lirico','Pop', 'Rock', 'Rap', 'Heavy Metal', 'Reggae', 'Salsa', 'Pop latino', 'Blues', 'Country', 'Dance', 'Tecno', 'Punk', 'Hip Hop', 'Soul', 'Electro Pop', 'Otros'];
  instrumentos : string[] = ['Piano','Bateria','Guitarra española', 'Guitarra electrica', 'Bajo', 'Bandurria', 'Violin', 'Violonchero', 'Bombo', 'Castañuelas', 'Trombon', 'Trompeta', 'Cantante', 'Otros']
  estilobailes : string[] = ['Cumbia', 'Salsa', 'Tango', 'Hiphop', 'Chachacha', 'Pasodoble', 'Samba', 'Merengue', 'Breakdance', 'Funky', 'Pole Dance', 'Ballet clasico', 'Claque', 'Flamenco', 'sevillanas', 'Contemporaneo', 'Otros']

  childForm: FormGroup;
  submitted = false;

  isavailable = false;

  avatarFile: File = null;
  copyDNIFather: File = null;
  CopyDNIMother: File = null;
  familyBookFile: File = null;
  copySocialNumber: File = null;
  copyDNIkid: File = null;

  @ViewChild (TemplateRef, {static: false}) tpl: TemplateRef <any>;

  constructor(
    private authService: AuthService,
    public ngxSmartModalService: NgxSmartModalService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    
  }

  ngOnInit() {
    this.childForm = this.formBuilder.group({
      username: ['', Validators.required],
      nombres: [null, [Validators.required, Validators.minLength(5)]],
      acceptTerms: [false, Validators.requiredTrue],
      apellidos: ['', Validators.required],
      email: ['', [Validators.required, Validators.email,Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['',Validators.required],
      sexo: [''],
      actor:[''],
      videoBook:[''],
      estilocantos:[''],
      habdeportes:[''],
      deporte:[''],
      placebirth:['',Validators.required],
      estilobailes: [''],
      bailes:[''],
      etnico: [''],
      edad: ['',Validators.requiredTrue],
      codpostal: [''],
      musicos: [''],
      telefono: ['',[Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
      telefonofather: ['',[Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
      telefonomother: ['',[Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
      fechaNacimiento: [''],
      nacionalidad: [null, [Validators.required]],
      acento: [''],
      tallaPantalon: [''],
      tallaCamisa: [''],
      tallaChaqueta: [''],
      localidad: [''],
      provincia: [''],
      direccion: ['', Validators.required],
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
      numeroDNI: ['', Validators.required],
      numeroSeguridadSocial: ['', Validators.required],
      numeroDNIPadre: ['', Validators.required],
      numeroDNIMadre: ['',Validators.required],
      numeroDNIRepresentante: [''],
      ultimosTrabajos: [''],
      avatar: [''],
      copyDNIFather: [''],
      CopyDNIMother: [''],
      copySocialNumber: [''],
      copyDNIkid: [''],
      libroFamilia: [''],
    }

    , {
      validator: MustMatch('password', 'confirmPassword')
    });

  }

  changemonths(event) {
    
  

  }

  signupChild() {
    this.submitted = true;
    if (this.childForm.invalid) {
      return;
    }
    const newChild = this.childForm.value;
    alert('Companía a registrar: ' + JSON.stringify(newChild))
    this.authService.signup(newChild).subscribe(
      res => {
        localStorage.setItem('token', res.token);
        this.ngxSmartModalService.create('confirm', 'Cuenta de Niño creada exitosamente').open();
        this.router.navigate(['/homeuser']);
      },
      (err) => {
        this.ngxSmartModalService.create('confirm', 'Se ha presentado un Error, vuelva a intentarlo y si el problema persiste, contáctenos').open();
        console.log(JSON.stringify(err));
      });
  }

  onAvatarSelected(event) {
    this.avatarFile = event.target.files[0] as File;
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

  copySocialNumberSelected(event){
    this.copySocialNumber = event.target.files[0] as File;
  }

  copyDNIkidSelected(event){
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
