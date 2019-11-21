import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../Services/auth.service';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {
  companyInfo;

  constructor(
    private authService: AuthService,
  ) {
    this.authService.getUser().subscribe(res => this.companyInfo = res);
  }

  ngOnInit() {
  }

}
