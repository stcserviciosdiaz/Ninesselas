import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {
  //modalbtn: boolean;

  @Input() modalbtn: boolean;
  

  constructor() { }

  ngOnInit() {
  }

  closebtn(){
    this.modalbtn = false;
  }

}
