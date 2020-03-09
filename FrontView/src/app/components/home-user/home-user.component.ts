import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { Observable } from 'rxjs/internal/Observable';
import { AngularFireStorage } from '@angular/fire/storage';
import { Usuario } from 'src/app/models/usuario';
import { Router } from '@angular/router';
import { SeoService } from 'src/app/Services/seo.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-home-user',
  templateUrl: './home-user.component.html',
  styleUrls: ['./home-user.component.css']
})
export class HomeUserComponent implements OnInit {
  userInfo: Usuario = new Usuario();
  avatarImageUrl;
  subscriber;

  urlImage: Observable<string>;


  constructor(
    private title: Title,
    private seo: SeoService,
    private router: Router,
    private storage: AngularFireStorage,
    public authService: AuthService,
    public ngxSmartModalService: NgxSmartModalService,
  ) { }

  ngOnInit() {
    let t:string = "Ninesselas - Usuarios";
    this.title.setTitle(t);

    this.seo.generateTags({
      title: "Ninesselas - Usuarios",
      description: "Nines Selas Agency",
      slug: "usuarios"
    });

    this.authService.findByToken().subscribe(
      res => {
        this.userInfo = res;
        let filePath = this.userInfo.avatar;
        let ref = this.storage.ref(filePath);
        this.urlImage = ref.getDownloadURL();
        ref.getDownloadURL().subscribe(resp => {
          this.urlImage = resp;
        });


        if (this.userInfo.motoList.length === 0) {
          this.userInfo.motoList
            .push({
              idMoto: 0,
              colorMoto: 'N/A',
              fotoMoto: 'N/A',
              modeloMoto: 'N/A'
            }
            );
        }

        if (this.userInfo.cocheList.length === 0) {
          this.userInfo.cocheList
            .push(
              {
                idCoche: 0,
                colorCoche: 'N/A',
                fotoCoche: 'N/A',
                modeloCoche: 'N/A'
              }
            );
        }


      },
      (err) => {
        this.ngxSmartModalService.create('confirm', 'Se ha presentado un Error, vuelva a intentarlo y si el problema persiste, contáctenos').open();
        console.log(JSON.stringify(err));
      });
  }


  /**IR A EDICION DE USUARIO */
  editarUser(idList: any, user: any) {
    //localStorage.setItem('useredit', user.idUser);
    if (user.idType.nombres === 'FIGURACION') {
      this.router.navigate(['/figuracionedit']);
      localStorage.setItem('figuracionedit', user.idUser);
    } else if (user.idType.nombres === 'ACTOR') {
      this.router.navigate(['/actoredit']);
      localStorage.setItem('actoredit', user.idUser);
    } else if (user.idType.nombres === 'NIÑOS') {
      this.router.navigate(['/ninioedit']);
      localStorage.setItem('ninioedit', user.idUser);
    }
  }

}
