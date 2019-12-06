import {Component, NgModule, Input, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import { AuthService } from '../../Services/auth.service';
import {Router} from '@angular/router';
import {BrowserModule} from '@angular/platform-browser';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

@Component({
  selector: 'app-actors',
  templateUrl: './actors.component.html',
  styleUrls: ['./actors.component.css']
})
export class ActorsComponent implements OnInit {
  actorForm: FormGroup;
  selectedFile: File = null;
  disa = false;
  deporte : string[] = ['Profesional','No Profesional'];
  bailes : string[] = ['Profesional','No Profesional'];
  musicos : string[] = ['Profesional','No Profesional'];
  cantos : string[] = ['Profesional','No Profesional'];
  idiomasHablados : string[] = ['Frances', 'Alemén', 'Catalán', 'valenciano'];
  habilidades : string[] = ['Skater', 'Skater Acuático', 'Pompas Jabón', 'Presentador', 'Magia', 'Surf', 'Buceo', 'Surf', 'Cómico', 'Motocross', 'Mimo', 'Puenting', 'Sky', 'Parapente', 'Ciclismo BMX', 'Parkour snowboarding', 'Sombras chinescas']
  flamenco : string[] = ['Lirico','Pop', 'Rock', 'Rap', 'Heavy Metal', 'Reggae', 'Salsa', 'Pop latino', 'Blues', 'Country', 'Dance', 'Tecno', 'Punk', 'Hip Hop', 'Soul', 'Electro Pop', 'Otros'];
  instrumentos : string[] = ['Piano','Bateria','Guitarra española', 'Guitarra electrica', 'Bajo', 'Bandurria', 'Violin', 'Violonchero', 'Bombo', 'Castañuelas', 'Trombon', 'Trompeta', 'Cantante', 'Otros']
  estilobailes : string[] = ['Cumbia', 'Salsa', 'Tango', 'Hiphop', 'Chachacha', 'Pasodoble', 'Samba', 'Merengue', 'Breakdance', 'Funky', 'Pole Dance', 'Ballet clasico', 'Claque', 'Flamenco', 'sevillanas', 'Contemporaneo', 'Otros']
  habdeportes : string [] = ['Tenis','Esgrima','Tiro con arco','Polo','Golf','Boxeo','Voleibol','Baloncesto','Montar a caballo','Natación','Padel','Artes marciales']
  /* idiomasHablados = [
    {id: 0, nombreIdioma: 'Inglés', nivelIdioma: 'Nivel Medio' , isChecked: false},
    {id: 1, nombreIdioma: 'Francés', nivelIdioma: 'Nivel Medio', isChecked: false },
    {id: 2, nombreIdioma: 'Alemán', nivelIdioma: 'Nivel Medio', isChecked: false },
    {id: 3, nombreIdioma: 'Italiano', nivelIdioma: 'Nivel Medio', isChecked: false },
    {id: 4, nombreIdioma: 'Catalán', nivelIdioma: 'Nivel Medio', isChecked: false },
  ]; */

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
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
      email: [''],
      password: [''],
      bailes:[''],
      habilidades:[''],
      username: [''],
      nombres: [''],
      estilobailes:[''],
      cantos: [''],
      flamenco:[''],
      instrumentos:[''],
      deporte: [''],
      apellidos: [''],
      nombreArtistico: [''],
      sexo: [''],
      telefono: [''],
      fechaNacimiento: [''],
      nacionalidad: [''],
      localidad: [''],
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
      numeroDNI: [''],
      numeroSeguridadSocial: [''],
      carnetConducir: [''],
      modeloCoche: [''],
      colorCoche: [''],
      modeloMoto: [''],
      colorMoto: [''],
      ultimosTrabajos: [''],
    });
  }

  registrarActor() {
    const newIdioma = [];
   /*  for (const item of this.idiomasHablados) {
      if (item.isChecked === true) {
        newIdioma.push({nombreIdioma: item.nombreIdioma, nivelIdioma: item.nivelIdioma});
      }
    } */
    const newUserObject = this.actorForm.value;
    newUserObject.idiomasHablados = newIdioma;
    alert(JSON.stringify(newUserObject))
    this.authService.signup(newUserObject).subscribe(
      res => {
        localStorage.setItem('token', res.token);
        console.log('Cuenta de Actor/Modelo creada exitosamente');
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
  }

  onCheckLanguageLevel(event, i) {
    this.idiomasHablados[i].nivelIdioma = event.target.value;
  } */

}
