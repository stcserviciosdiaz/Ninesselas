import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { HomeComponent } from './components/home/home.component';
import { ModelsComponent } from './components/models/models.component';
import { LoginComponent } from './components/user/login/login.component';
import { ContactComponent } from './components/contact/contact.component';
import { FigurationComponent } from './components/figuration/figuration.component';
import { ActorsComponent } from './components/actors/actors.component';
import { ContratorComponent } from './components/contrator/contrator.component';
import { CompanyComponent } from './components/company/company.component';
import { RegisterComponent } from './components/user/register/register.component';


const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'models', component: ModelsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'figuration', component: FigurationComponent },
  { path: 'actors', component: ActorsComponent },
  { path: 'contrator', component: ContratorComponent },
  { path: 'company', component: CompanyComponent },
  { path: '',   redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
