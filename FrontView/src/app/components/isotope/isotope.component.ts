import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-isotope',
  templateUrl: './isotope.component.html',
  styleUrls: ['./isotope.component.css']
})
export class IsotopeComponent implements OnInit {
  FFigur = true;
  MModls = true;
  AActrs = true;
  NNChild = true;

  constructor() { }

  ngOnInit() {
  }

  filter(e){
    e.preventDefault();
  }

  viewtools(e){
    this.FFigur = true;
    this.MModls = true;
    this.AActrs = true;
    this.NNChild = true;
  }

  viewFiguration(e){
    this.FFigur = false;
    if (this.FFigur = true) {
      this.MModls = false;
      this.AActrs = false;
      this.NNChild = false;
    }else{
      return false;
    }
  }
  viewModls(e){
    this.MModls = false;
    if (this.MModls = true) {
      this.AActrs = false;
      this.NNChild = false;
      this.FFigur = false;
    }else{
      return false;
    }
  }
  viewAtrs(e){
    this.AActrs = false;
    if (this.AActrs = true) {
      this.MModls = false;
      this.NNChild = false;
      this.FFigur = false;
    }else{
      return false;
    }
  }
  viewChild(e){
    this.NNChild = false;
    if (this.NNChild = true) {
      this.MModls = false;
      this.AActrs = false;
      this.FFigur = false;
    }else{
      return false;
    }
  }

}
