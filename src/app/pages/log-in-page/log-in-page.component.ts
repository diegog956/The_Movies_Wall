import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { local } from 'd3-selection';
import { UsersDatabaseService } from 'src/app/services/users-database.service';

@Component({
  selector: 'app-log-in-page',
  templateUrl: './log-in-page.component.html',
  styleUrls: ['./log-in-page.component.css']
})
export class LogInPageComponent implements OnInit {

  title: string = '¡Bienvenido!'
  public formLogin!: FormGroup;

  email!: string;
  password!: string;

  constructor(private formBuilder: FormBuilder, private userDataService: UsersDatabaseService, private router: Router) { }
  ngOnInit(): void {
    this.formLogin = this.formBuilder.group({

      Email: ['', [Validators.required]],
      Password: ['', [Validators.required]],

    })
  }

  async login() {/*Coteja los datos ingresados. Si son correctos almacena al usuario en la cache para su posterior uso */

    this.email = this.formLogin.controls['Email'].value;
    this.password = this.formLogin.controls['Password'].value;

    if (await this.userDataService.authentication(this.email, this.password)) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', this.email);

      const user = await this.userDataService.getUser(this.email);
      if(user){
      localStorage.setItem('id', user.id.toString());
      localStorage.setItem('name', user.Name);
      }
      this.router.navigate(['/Home']);
    } else {

      alert("Email y/o contraseña incorrecto");
    }
  }

  
}
