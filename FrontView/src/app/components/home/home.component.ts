import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../Services/auth.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  modalbtn: true;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    
  }

  ninesselabtn(){
    
  }

 
  

  

}
