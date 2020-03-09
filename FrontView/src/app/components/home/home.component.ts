import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import {AuthService} from '../../Services/auth.service';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { Title } from '@angular/platform-browser';
import { SeoService } from '../../Services/seo.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild (TemplateRef, {static: false}) tpl: TemplateRef <any>;
  constructor(
    private title: Title,
    private seo: SeoService,
    public authService: AuthService,
    public ngxSmartModalService: NgxSmartModalService) { }

  ngOnInit() {
    let t:string = "Ninesselas";
    this.title.setTitle(t);

    this.seo.generateTags({
      title: "Ninesselas",
      description: "Nines Selas Agency",
      slug: "inicio"
    });
  }

}
