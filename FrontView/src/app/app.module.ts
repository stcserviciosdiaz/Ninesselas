import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AuthService } from './Services/auth.service';
import { EmailService } from './Services/email.service';
import { AuthGuard } from './Guards/auth.guard';
import {TokenInterceptorService} from './Services/token-interceptor.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { FooterComponent } from './components/footer/footer.component';
import { ManagementComponent } from './components/management/management.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { HeaderComponent } from './components/header/header.component';
import { TermsComponent } from './components/terms/terms.component';
import { PrivacyComponent } from './components/privacy/privacy.component';
import { RegisterComponent } from './components/user/register/register.component';
import { LoginComponent } from './components/user/login/login.component';
import { ContactComponent } from './components/contact/contact.component';
import { ActorsComponent } from './components/actors/actors.component';
import { CompanyComponent } from './components/company/company.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HomeUserComponent } from './components/home-user/home-user.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {MatToolbarModule} from '@angular/material/toolbar';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FooterComponent,
    ManagementComponent,
    PageNotFoundComponent,
    HeaderComponent,
    TermsComponent,
    PrivacyComponent,
    RegisterComponent,
    LoginComponent,
    ContactComponent,
    ActorsComponent,
    CompanyComponent,
    HomeUserComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatToolbarModule
  ],
  providers: [
    AuthService,
    EmailService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
