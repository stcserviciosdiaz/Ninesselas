import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ComponentsComponent } from './components/components.component';
import { HomeComponent } from './components/home/home.component';
import { FooterComponent } from './components/footer/footer.component';
import { ManagementComponent } from './components/management/management.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ContratorComponent } from './components/contrator/contrator.component';
import { HeaderComponent } from './components/header/header.component';
import { ModelsComponent } from './components/models/models.component';
import { TermsComponent } from './components/terms/terms.component';
import { PrivacyComponent } from './components/privacy/privacy.component';
import { UserComponent } from './components/user/user.component';
import { RegisterComponent } from './components/user/register/register.component';
import { LoginComponent } from './components/user/login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    ComponentsComponent,
    HomeComponent,
    FooterComponent,
    ManagementComponent,
    PageNotFoundComponent,
    ContratorComponent,
    HeaderComponent,
    ModelsComponent,
    TermsComponent,
    PrivacyComponent,
    UserComponent,
    RegisterComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
