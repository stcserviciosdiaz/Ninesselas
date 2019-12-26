import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import { NgxSmartModalService } from 'ngx-smart-modal';

@Component({
  selector: 'app-home-user',
  templateUrl: './home-user.component.html',
  styleUrls: ['./home-user.component.css']
})

export class HomeUserComponent implements OnInit {
  userInfo;
  avatarImageUrl;
  subscriber;

  constructor(
    public authService: AuthService,
    public ngxSmartModalService: NgxSmartModalService,
  ) { }


  ngOnInit() {
    let usuario = {
      "acento": '',
      "altura": '',
      "apellidos": '',
      "carnetConducir": '',
      "codigoPostal": '',
      "colorOjos": '',
      "colorPelo": '',
      "colorPiel": '',
      "curriculumVitae": '',
      "direccion": '',
      "dniMadre": '',
      "dniRepresentante": '',
      "dniPadre": '',
      "dniUser": '',
      "email": '',
      "fechaNacimiento": '',
      "libroFamilia": '',
      "localidad": '',
      "nacionalidad": '',
      "nombreArtistico": '',
      "nombreCompleto": '',
      "nombres": '',
      "numeroSeguroSocial": '',
      "observaciones": '',
      "password": '',
      "pathDniMadre": '',
      "pathDniPadre": '',
      "pathDniUser": '',
      "pathDniRepresentante": '',
      "pathSeguroSocial": '',
      "provincia": '',
      "sexo": '',
      "telefono": '',
      "telefonoMadre": '',
      "telefonoPadre": '',
      "lugarNacimiento": '',
      "edad": 0,
      "actor": '',
      "username": '',
      "videobook": '',
      "instrumentoList": [],
      "estilosCantoList": [],
      "deporteList": [
        {
          "idDeporte": 1,
          "descripcionDeporte": "NO APLICA",
          "nombreDeporte": "NO APLICA"
        }
      ],
      "estiloBaileList": [],
      "idiomasList": [],
      "habilidadesList": [],
      "tallasList": [],
      "ultimosTrabajosList": [],
      "idCantante": {
        "idCantante": 1,
        "descripcionCantante": "NO APLICA",
        "nombreCantante": "NOAPLICA"
      },
      "idBailarin": {
        "idBailarin": 1,
        "descripcionBailarin": "NO APLICA",
        "nombreBailarin": "NO APLICA"
      },
      "idEtnia": {
        "idEtnia": 1,
        "nombreEtnia": "BLANCO editado"
      },
      "idType": {
        "idType": 1,
        "description": "ACTOR",
        "nombres": "ACTOR"
      },
      "idDeportista": {
        "idDeportista": 1,
        "descripcionDeportista": "NO APLICA",
        "nombreDeportista": "NO APLICA"
      },
      "idMusico": {
        "idMusico": 1,
        "descipcionMusico": "NO APLICA",
        "nombreMusico": "NO APLICA"
      },
      "motoList": [],
      "cocheList": [],
      "fotosTatuajesList": [],
      "fotosManosList": []
    }

    /*this.userInfo = this.authService.obtenerUsuario();
    usuario=this.userInfo;*/
    this.subscriber = this.authService.findByToken().subscribe(
      res => {
        this.userInfo = res;
      },
      (err) => {
        this.ngxSmartModalService.create('confirm', 'Se ha presentado un Error, vuelva a intentarlo y si el problema persiste, contáctenos').open();
        console.log(JSON.stringify(err));
      });

    /*this.authService.obtenerUsuario().subscribe(
      res => {
        this.userInfo = res;
      });*/
    // this.authService.getAvatar()
    //   .subscribe(resp => {
    //     this.avatarImageUrl = resp;
    //     console.log('segunda ' );
    //     console.log(JSON.stringify(resp));
    //   });
  }

}
