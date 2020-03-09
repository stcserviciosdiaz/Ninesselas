import { Component, OnInit } from '@angular/core';
import { SeoService } from 'src/app/Services/seo.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor(
    private title: Title,
    private seo: SeoService,
  ) { }
  
  ngOnInit() {
    let t:string = "Ninesselas - Sobre nosotros";
    this.title.setTitle(t);

    this.seo.generateTags({
      title: "Ninesselas - Sobre nosotros",
      description: "Nines Selas Agency",
      slug: "sobre-nosotros"
    });
    
  }
}
