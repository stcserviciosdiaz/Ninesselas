import { Component } from '@angular/core';
import { AuthService } from './Services/auth.service';
import { DateAdapter } from '@angular/material/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'FrontView';
  constructor(
    private authService: AuthService,
    private _adapter: DateAdapter<any>
  ) { this._adapter.setLocale('es');}
}
