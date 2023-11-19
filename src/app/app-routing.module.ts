import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { LogInPageComponent } from './pages/log-in-page/log-in-page.component';
import { MoviePageComponent } from './pages/movie-page/movie-page.component';
import { SignUpPageComponent } from './pages/sign-up-page/sign-up-page.component';
import { LogInAccessGuard } from './guards/log-in-access.guard';
import { AdminPageComponent } from './pages/admin-page/admin-page/admin-page.component';

const routes: Routes = [
  {path: 'Home', component: HomePageComponent, canActivate:[LogInAccessGuard]},
  {path: 'LogIn', component: LogInPageComponent},
  {path: 'Movie-id/:id', component: MoviePageComponent,canActivate:[LogInAccessGuard]},
  {path: 'SignUp', component: SignUpPageComponent},
  {path: 'Admin', component: AdminPageComponent, canActivate:[LogInAccessGuard]},
  {path: '**', redirectTo:'LogIn'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
