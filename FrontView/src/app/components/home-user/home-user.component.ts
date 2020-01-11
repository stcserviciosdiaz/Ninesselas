import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { Observable } from 'rxjs/internal/Observable';
import { AngularFireStorage } from '@angular/fire/storage';
import { Usuario } from 'src/app/models/usuario';

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
    private storage: AngularFireStorage,
    public authService: AuthService,
    public ngxSmartModalService: NgxSmartModalService,
  ) { }

  ngOnInit() {

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

}
