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

  art={
    pytName: null,
    pytDescript: null,
    id: null,
    fullname: null,
    artname: null,
    gender: null,
    country: null,
    day: null,
    sizePant: null,
    sizeShirt: null,    
  }

  ptyUser = [{ id:1, fullname:'papas', artname:'artistico 01', gender:'Masculino', country:'Ecuador', day:'30 de noviembre', sizePant:'16', sizeShirt: '10'},
               {id:2, fullname:'manzanas', artname:'artistico 02', gender:'Masculino', country:'Ecuador', day:'30 de noviembre', sizePant:'16', sizeShirt: '10'},
               {id:3, fullname:'melon', artname:'artistico 03', gender:'Masculino', country:'Ecuador', day:'30 de noviembre', sizePant:'16', sizeShirt: '10'},
               {id:4, fullname:'cebollas', artname:'artistico 04', gender:'Masculino', country:'Ecuador', day:'30 de noviembre', sizePant:'16', sizeShirt: '10'},
               {id:5, fullname:'calabaza', artname:'artistico 05', gender:'Masculino', country:'Ecuador', day:'30 de noviembre', sizePant:'16', sizeShirt: '10'},
            ];

  constructor(public authService: AuthService,
  ) { }

  ngOnInit() {
  }

  /*** Seleccionar Usuario */
  ptySeleccion(art) {
    this.art.id=art.id;
    this.art.fullname=art.fullname;
    this.art.artname=art.artname;
    this.art.gender=art.gender;
    this.art.country=art.country;
    this.art.day=art.day;
    this.art.sizePant=art.sizePant;
    this.art.sizeShirt=art.sizeShirt;
  }

  /*** Crear Proyect */
  ptyCrear() {
    this.Oncreated = true;
  }

  /*** Borrar Proyect */
  ptyborrar(art) {
    this.Oncreated = false;
  } 

}
