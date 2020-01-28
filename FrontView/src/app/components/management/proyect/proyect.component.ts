import { Component, OnInit, ViewChild, HostListener, Input } from '@angular/core';
import { AuthService } from 'src/app/Services/auth.service';
import { MdbTableDirective } from 'angular-bootstrap-md';
import { Usuario } from 'src/app/models/usuario';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-proyect',
  templateUrl: './proyect.component.html',
  styleUrls: ['./proyect.component.css']
})
export class ProyectComponent implements OnInit {

  Oncreated = false;

  constructor(public authService: AuthService,
  ) { }

  ngOnInit() {
  }

  /***Crear Proyect */
  setUpProyect(){
    this.Oncreated = true;
  }

}
