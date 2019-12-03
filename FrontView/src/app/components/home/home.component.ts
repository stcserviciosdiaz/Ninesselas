import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import {AuthService} from '../../Services/auth.service';
import { NgxSmartModalService } from 'ngx-smart-modal';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild (TemplateRef, {static: false}) tpl: TemplateRef <any>;
  constructor(
    public authService: AuthService,
    public ngxSmartModalService: NgxSmartModalService) { }

  ngOnInit() {
  }

}
