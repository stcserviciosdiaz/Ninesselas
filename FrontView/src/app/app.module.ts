import { ActorEditComponent } from './components/management/actor-edit/actor-edit.component';
import { FiguracionEditComponent } from './components/management/figuracion-edit/figuracion-edit.component';
import { ManagementCompanyComponent } from './components/management/management-company/management-company.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AuthService } from './Services/auth.service';
import { EmailService } from './Services/email.service';
import { AuthGuard } from './Guards/auth.guard';
import { TokenInterceptorService } from './Services/token-interceptor.service';
import { MatSliderModule } from '@angular/material/slider';

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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HomeUserComponent } from './components/home-user/home-user.component';
import { ForgotComponent } from './components/user/forgot/forgot.component';

import { HashLocationStrategy, LocationStrategy } from '@angular/common';


import {
  MatButtonModule,
  MatMenuModule,
  MatToolbarModule,
  MatIconModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatDatepickerModule,
  MatDatepicker,
  MatNativeDateModule,
  MatRadioModule,
  MatSelectModule,
  MatOptionModule,
  MatSlideToggleModule,
  ErrorStateMatcher,
  ShowOnDirtyErrorStateMatcher,
  MatTooltipModule,
  MatButtonToggleModule,
  MatCheckboxModule,
  MatExpansionModule,
  MAT_DATE_LOCALE,
  DateAdapter
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MDBBootstrapModule } from 'angular-bootstrap-md';


import 'hammerjs';
import { FiguracionComponent } from './components/figuracion/figuracion.component';
import { IsotopeComponent } from './components/isotope/isotope.component';
import { ChildrenComponent } from './components/children/children.component';
import { NgxSmartModalModule } from 'ngx-smart-modal';

import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { DatePipe } from './pipes/date/date.pipe';
import { UserEditComponent } from './components/management/user-edit/user-edit.component';
import { AboutComponent } from './components/about/about.component';
import { ProyectComponent } from './components/management/proyect/proyect.component';
@NgModule({
  declarations: [
    ActorEditComponent,
    UserEditComponent,
    FiguracionEditComponent,
    ManagementCompanyComponent,
    AppComponent,
    HomeComponent,
    FooterComponent,
    ManagementComponent,
    PageNotFoundComponent,
    DatePipe,
    HeaderComponent,
    TermsComponent,
    PrivacyComponent,
    RegisterComponent,
    LoginComponent,
    ContactComponent,
    ActorsComponent,
    CompanyComponent,
    HomeUserComponent,
    FiguracionComponent,
    ForgotComponent,
    IsotopeComponent,
    ChildrenComponent,
    AboutComponent,
    ProyectComponent,
  ],
  imports: [
    MatSliderModule,
    MDBBootstrapModule.forRoot(),
    NgxSmartModalModule.forRoot(),
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    BrowserModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatMenuModule,
    MatToolbarModule,
    MatTooltipModule,
    MatIconModule,
    MatCardModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatSelectModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatOptionModule,
    MatSlideToggleModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule
  ],
  exports: [
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatSelectModule,
    MatOptionModule,
    MatSlideToggleModule
  ],
  providers: [
    AuthService,
    EmailService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    {
      provide: ErrorStateMatcher,
      useClass: ShowOnDirtyErrorStateMatcher
    },
    {provide: MAT_DATE_LOCALE, useValue: 'es-ES'},

    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    
  ],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule { }
