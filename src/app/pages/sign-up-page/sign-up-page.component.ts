import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/interfaces/User';
import { UsersDatabaseService } from 'src/app/services/users-database.service';


@Component({
  selector: 'app-sign-up-page',
  templateUrl: './sign-up-page.component.html',
  styleUrls: ['./sign-up-page.component.css']
})
export class SignUpPageComponent implements OnInit {
  title: string = 'Crea tu cuenta '
  public formLogin!: FormGroup;
  id!: number;
  constructor(private formBuilder: FormBuilder, private userService: UsersDatabaseService) { }


  ngOnInit(): void { 

    this.formLogin = this.formBuilder.group({
      Name: ['',[Validators.required,Validators.maxLength(20)]],
      Email: ['',[Validators.required,Validators.email]],
      Password: ['',[Validators.required,Validators.minLength(6)]],
      BirthDate: ['', Validators.required],
      Country: ['', Validators.required],
      Terms: [false, Validators.requiredTrue]
    })

  }


  async SignUp(): Promise<any> {/*Recupera el ultimo ID creado, recibe datos en formularios y añade a Base de Datos */
    
    try {
      const users = await this.userService.getUsers();

      if (users) {
        for (let user of users) {

          this.id = user.id;
        
        }      
      }
    }
    catch (error) {
      console.log(error);
    }



    const user: User = {
      id: this.id + 1, 
      Name: this.formLogin.controls['Name'].value, 
      Email: this.formLogin.controls['Email'].value,
      Password: this.formLogin.controls['Password'].value,
      BirthDate: this.formLogin.controls['BirthDate'].value,
      Country: this.formLogin.controls['Country'].value,
      FavMovies: [] 
    }
  
    this.userService.add(user);

    this.userService.addCountry(this.formLogin.controls['Country'].value);

  }

  getTodayDate(): string {/*Parseo de la fecha para mejor visualizacion */
    const today = new Date();
    const year = today.getFullYear();
    let month: string | number = today.getMonth() + 1;
    let day: string | number = today.getDate();
  
    if (month < 10) {
      month = `0${month}`;
    }
  
    if (day < 10) {
      day = `0${day}`;
    }
  
    return `${year}-${month}-${day}`;
  }

}
