import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../Services/auth.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  modalbtn: true;

  constructor(public authService: AuthService) { }

  ngOnInit() {
  }

<<<<<<< HEAD
=======
  ninesselabtn(){
    
  }

 
  

  

>>>>>>> da85499aa8e12e837e2e46f8a2511dc032807eae
}
