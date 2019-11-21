import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-home-user',
  templateUrl: './home-user.component.html',
  styleUrls: ['./home-user.component.css']
})
export class HomeUserComponent implements OnInit {
  userInfo;
  avtaraImage;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.getUser().subscribe(res => this.userInfo = res);
  }

}
