import { Injectable } from '@angular/core';
import { Router, CanActivate  } from '@angular/router';
import { UsersDatabaseService } from '../services/users-database.service';

@Injectable({
  providedIn: 'root'
})
export class LogInAccessGuard implements CanActivate  {

  constructor(private router: Router, private userService: UsersDatabaseService) {}

  canActivate(): boolean {
    
    if (!this.userService.isAuthenticated()) {
      
      this.router.navigate(['/LogIn']);
      return false;
    }
    return true;
  } 
}
