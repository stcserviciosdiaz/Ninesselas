import { Component, OnInit } from '@angular/core';
import { SeoService } from 'src/app/Services/seo.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.css']
})
export class TermsComponent implements OnInit {

  constructor(
    private title: Title,
    private seo: SeoService,
  ) { }

  ngOnInit() {
    let t:string = "Ninesselas - Terminos y Condiciones";
    this.title.setTitle(t);

    this.seo.generateTags({
      title: "Ninesselas - Terminos y Condiciones",
      description: "Nines Selas Agency",
      slug: "terminos-y-condiciones"
    });
  }

}
