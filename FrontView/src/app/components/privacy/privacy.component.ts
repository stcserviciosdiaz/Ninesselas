import { Component, OnInit } from '@angular/core';
import { SeoService } from 'src/app/Services/seo.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.css']
})
export class PrivacyComponent implements OnInit {

  constructor(
    private title: Title,
    private seo: SeoService,
  ) { }

  ngOnInit() {
    let t:string = "Ninesselas - Politica y Privacidad";
    this.title.setTitle(t);

    this.seo.generateTags({
      title: "Ninesselas - Politica y Privacidad",
      description: "Nines Selas Agency",
      slug: "politica-y-privacidad"
    });
  }

}
