import {Component, Input, OnDestroy, OnInit, ViewChild, TemplateRef} from '@angular/core';
import {FormBuilder, FormGroup, FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import { AuthService } from '../../Services/auth.service';
import {Router} from '@angular/router';
import { ErrorStateMatcher } from '@angular/material';
import { NgxSmartModalService } from 'ngx-smart-modal';

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

  actorForm: FormGroup;
  submitted = false;
  selectedFile: File = null;
  @Input() inputArray;
  subscriber;
  matcher = new MyErrorStateMatcher();
  bailes : string[] = ['Profesional','No Profesional'];
  etnico: string[] = ['Afro descendiente/Negro','Blanco','Indígena','Mestizo/Moreno','Asiático','Otro'];
  estilobailes : string[] = ['Cumbia', 'Salsa', 'Tango', 'Hiphop', 'Chachacha', 'Pasodoble', 'Samba', 'Merengue', 'Breakdance', 'Funky', 'Pole Dance', 'Ballet clasico', 'Claque', 'Flamenco', 'sevillanas', 'Contemporaneo', 'Otros']
  estilocantos : string[] = ['Lirico','Pop', 'Rock', 'Rap', 'Heavy Metal', 'Reggae', 'Salsa', 'Pop latino', 'Blues', 'Country', 'Dance', 'Tecno', 'Punk', 'Hip Hop', 'Soul', 'Electro Pop', 'Otros'];
  habilidades : string[] = ['Skater', 'Skater Acuático', 'Pompas Jabón', 'Presentador', 'Magia', 'Surf', 'Buceo', 'Surf', 'Cómico', 'Motocross', 'Mimo', 'Puenting', 'Sky', 'Parapente', 'Ciclismo BMX', 'Parkour snowboarding', 'Sombras chinescas']
  cantos : string[] = ['Profesional','No Profesional'];
  idiomasHablados : string[] = ['Gallego','Italiano','Rumano','Frances', 'Alemén', 'Catalán', 'valenciano','bilingüe'];
  @ViewChild (TemplateRef, {static: false}) tpl: TemplateRef <any>;
  constructor(
    private authService: AuthService,
    public ngxSmartModalService: NgxSmartModalService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.createRegisterForm();
  }

  onFileSelected(event) {
    this.selectedFile = event.target.files[0] as File;
  }


  ngOnInit() {
  }

  createRegisterForm() {
    this.actorForm = this.formBuilder.group({
      email: ['',[Validators.required,Validators.email,Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      password: ['',[Validators.required,Validators.minLength(5)]],
      confirmPassword: ['',Validators.required],
      username: ['',Validators.required],
      acceptTerms:['',Validators.required],
      habilidades: [''],
      cantos: [''],
      etnico: [''],
      estilocantos: [''],
      placebirth:['',Validators.required],
      idiomasHablados: [''],
      nombres: ['',Validators.required],
      apellidos: ['',Validators.required],
      localidad: [''],
      provincia: [''],
      bailes: [''],
      estilobailes:[''],
      codpostal: [''],
      direccion: [''],
      sexo: [''],
      telefono: ['',[Validators.required,Validators.minLength(6),Validators.maxLength(6)]],
      fechaNacimiento: [''],
      nacionalidad: [''],
      acento: [''],
      tallaPantalon: [''],
      tallaCamisa: [''],
      tallaChaqueta: [''],
      pie: [''],
      altura: [''],
      colorPiel: [''],
      colorPelo: [''],
      colorOjos: [''],
      numeroDNI: [''],
      numeroSeguridadSocial: [''],
      carnetConducir: [''],
      modeloCoche: [''],
      colorCoche: [''],
      fotoCoche: [''],
      modeloMoto: [''],
      colorMoto: [''],
      fotoMoto: [''],
      avatar: [''],
      tattoos: [''],
      manos: [''],
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
    const newUserObject = {
      rol: 'CommonUser',
      username: this.actorForm.get('username').value,
      email: this.actorForm.get('email').value,
      password: this.actorForm.get('password').value,
      nombres: this.actorForm.get('nombres').value,
      apellidos: this.actorForm.get('apellidos').value,
      sexo: this.actorForm.get('sexo').value,
      acento: this.actorForm.get('acento').value,
      telefono: this.actorForm.get('telefono').value,
      fechaNacimiento: this.actorForm.get('fechaNacimiento').value,
      nacionalidad: this.actorForm.get('nacionalidad').value,
      tallaPantalon: this.actorForm.get('tallaPantalon').value,
      tallaCamisa: this.actorForm.get('tallaCamisa').value,
      tallaChaqueta: this.actorForm.get('tallaChaqueta').value,
      pie: this.actorForm.get('pie').value,
      altura: this.actorForm.get('altura').value,
      colorPiel: this.actorForm.get('colorPiel').value,
      colorPelo: this.actorForm.get('colorPelo').value,
      colorOjos: this.actorForm.get('colorOjos').value,
      numeroDNI: this.actorForm.get('numeroDNI').value,
      modeloCoche: this.actorForm.get('modeloCoche').value,
      modeloMoto: this.actorForm.get('modeloMoto').value,
      carnetConducir: this.actorForm.get('carnetConducir').value,
      colorCoche: this.actorForm.get('colorCoche').value,
      colorMoto: this.actorForm.get('colorMoto').value,
      numeroSeguridadSocial: this.actorForm.get('numeroSeguridadSocial').value,
    };
    this.subscriber = this.authService.signup(newUserObject).subscribe(
      res => {
        localStorage.setItem('token', res.token);
        this.ngxSmartModalService.create('confirm', 'Cuenta de Figuración creada exitosamente').open();
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
