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
import {AuthGuard} from './Guards/auth.guard';
import {FiguracionComponent} from './components/figuracion/figuracion.component';
import { ForgotComponent } from './components/user/forgot/forgot.component';
import { ChildrenComponent } from './components/children/children.component';
import { PrivacyComponent } from './components/privacy/privacy.component';


const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'figuracion',component: FiguracionComponent},
  { path: 'forgot', component: ForgotComponent },
  { path: 'actors',component: ActorsComponent,},
  { path: 'children',component: ChildrenComponent,},
  { path: 'privacy',component: PrivacyComponent,},
  { path: 'company',
    component: CompanyComponent,
    canActivate: [AuthGuard]
  },
  { path: 'terms', component: TermsComponent },
  { path: 'homeuser',
    component: HomeUserComponent,
    canActivate: [AuthGuard]
  },
  { path: 'management',
    component: ManagementComponent,
    canActivate: [AuthGuard]
  },
  { path: '',   redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];


//imports: [RouterModule.forRoot(APP_ROUTES, { useHash: true })],

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
