import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { MoviePageComponent } from './pages/movie-page/movie-page.component';
import { LogInPageComponent } from './pages/log-in-page/log-in-page.component';
import { HttpClientModule } from '@angular/common/http';
import { NgOptimizedImage } from '@angular/common';
import { SignUpPageComponent } from './pages/sign-up-page/sign-up-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AdminPageComponent } from './pages/admin-page/admin-page/admin-page.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    MoviePageComponent,
    LogInPageComponent,
    SignUpPageComponent,
    AdminPageComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgOptimizedImage,
    ReactiveFormsModule,
    NgxChartsModule,
    BrowserAnimationsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
