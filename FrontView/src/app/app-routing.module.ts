import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/user/login/login.component';
import { ContactComponent } from './components/contact/contact.component';
import { ActorsComponent } from './components/actors/actors.component';
import { CompanyComponent } from './components/company/company.component';
import { RegisterComponent } from './components/user/register/register.component';
import { TermsComponent } from './components/terms/terms.component';
import { HomeUserComponent } from './components/home-user/home-user.component';
import { ManagementComponent } from './components/management/management.component';


const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'actors', component: ActorsComponent },
  { path: 'company', component: CompanyComponent },
  { path: 'terms', component: TermsComponent },
  { path: 'homeuser', component: HomeUserComponent },
  { path: 'management', component: ManagementComponent },
  { path: '',   redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
