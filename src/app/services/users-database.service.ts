import { Injectable } from '@angular/core';
import { User } from '../interfaces/User';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Movie } from '../interfaces/Movie';
import { count } from '@swimlane/ngx-charts';
import { UserComment } from '../interfaces/UserComment';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UsersDatabaseService {

  constructor(private router: Router, private httpClient: HttpClient) { }

  url: string = 'http://localhost:4000/Users/?timestamp=' + new Date().getTime();
  auth: boolean = false;


  async add(user: User) {

    try {
      await fetch(this.url, {
        method: 'POST',
        body: JSON.stringify(user),
        headers: { 'content-type': 'application/json' }
      })

      this.router.navigate(['Home']);

    } catch (error) {

      console.log(error);

    }

  }

  async getUsers(): Promise<User[] | undefined> {

    try {
      const result = await fetch(this.url);
      const Users = result.json();
      return Users;

    } catch (error) {

      console.log(error);
      return undefined;

    }


  }

  async authentication(email: string, password: string): Promise<boolean | undefined> {

    try {
      const users = await this.getUsers();



      if (users) {
        for (let user of users) {

          if (user.Email === email && user.Password === password) {
            this.auth = true;
            return true;
          }
        }
        this.auth = false;
        return false;
      } else {
        return undefined;
      }
    }
    catch (error) {
      console.log(error);
      return undefined;
    }


  }


  isAuthenticated() {
    return this.auth;
  }



  async getStats(url: string): Promise<any[] | undefined> {

    try {
      const result = await fetch(url);
      const Stats = result.json();
      return Stats;

    } catch (error) {

      console.log(error);
      return undefined;

    }


  }

  async getUser(email: string): Promise<User | undefined> {

    try {
      const users = await this.getUsers();


      if (users) {
        for (let user of users) {

          if (email == user.Email) {

            return user;

          }
        }
      }
      return undefined
    }
    catch (error) {
      console.log(error);
      return undefined;
    }
  }

  async getUserByID(id: string): Promise<User | undefined> {

    try {
      const users = await this.getUsers();


      if (users) {
        for (let user of users) {

          if (id == user.id.toString()) {

            return user;

          }
        }
      }
      return undefined
    }
    catch (error) {
      console.log(error);
      return undefined;
    }
  }


  async addFavMovieToUser(id: string, movie: Movie) {

    try {
      const users = await this.getUsers();

      if (users) {
        for (let user of users) {

          if (id == user.id.toString()) {

            user.FavMovies.push(movie);

            try {

              await fetch('http://localhost:4000/Users/' + id, {
                method: 'PUT',
                body: JSON.stringify(user),
                headers: { 'content-type': 'application/json' }
              })


              return true;
            } catch (error) {

              console.log(error);

              return false;

            }
          }
        }
        return false;
      }
      else {
        return undefined
      }
    }
    catch (error) {
      console.log(error);
      return undefined;
    }

  }


  async removeMovieFromFavorites(id: string, idmovie: String) {

    const user = await this.getUserByID(id);

    if (user) {

      let peliculaAEliminar = user.FavMovies.find(pelicula => pelicula.id == idmovie);

      if (peliculaAEliminar) {
        user.FavMovies = user.FavMovies.filter(pelicula => pelicula !== peliculaAEliminar);
        console.log(user.FavMovies);

        try {

          await fetch('http://localhost:4000/Users/' + id, {
            method: 'PUT',
            body: JSON.stringify(user),
            headers: { 'content-type': 'application/json' }
          })
        }
        catch (error) {
          console.log(error);
          return undefined;
        }

      }
      else {
        console.log('La película no fue encontrada.');
      }
    }
  }





  async MovieSearch(id: string, idmovie: string): Promise<boolean | undefined> {

    const user = await this.getUserByID(id)


    if (user) {
      for (let movie of user.FavMovies) {

        if (movie.id == idmovie) {

          return true;

        }
      }
      return false;
    }
    else {
      return undefined;
    }
  }


  async addCountry(country: string) {

    const stats = await this.getStats('http://localhost:4000/Countries');

    if (stats != undefined) {
      const countryIndex = stats.findIndex(c => c.id === country);

      if (countryIndex !== -1) {

        stats[countryIndex].value += 1;


      }

      try {

        await fetch('http://localhost:4000/Countries/' + country, {
          method: 'PUT',
          body: JSON.stringify(stats[countryIndex]),
          headers: { 'content-type': 'application/json' }
        })
      }
      catch (error) {
        console.log(error);
        return undefined;
      }


    }
  }


  async addGenre(genres: any[]) {

    const stats = await this.getStats('http://localhost:4000/Genres');

    if (stats) {

      for (let genre of genres) {

        const genreIndex = stats.findIndex(c => c.id === genre.id);

        if (genreIndex !== -1) {

          stats[genreIndex].value += 1;


          try {

            await fetch('http://localhost:4000/Genres/' + genre.id, {
              method: 'PUT',
              body: JSON.stringify(stats[genreIndex]),
              headers: { 'content-type': 'application/json' }
            })
          }
          catch (error) {
            console.log(error);
            return undefined;
          }
        }
      }
    }
  }

  async removeGenre(genres: any[]) {

    const stats = await this.getStats('http://localhost:4000/Genres');

    if (stats) {

      for (let genre of genres) {

        const genreIndex = stats.findIndex(c => c.id === genre.id);

        if (genreIndex !== -1) {

          stats[genreIndex].value -= 1;


          try {

            await fetch('http://localhost:4000/Genres/' + genre.id, {
              method: 'PUT',
              body: JSON.stringify(stats[genreIndex]),
              headers: { 'content-type': 'application/json' }
            })
          }
          catch (error) {
            console.log(error);
            return undefined;
          }
        }
      }
    }
  }

  async getUserAndComment(id: string): Promise<any | undefined> {

    try {
      const url = "http://localhost:4000/Comments/" + id;
      const result = await fetch(url);


      if (result.ok) {
        const comments = await result.json();
        return comments;
      }

      return undefined;

    }
    catch (error) {
      console.log(error);
      return undefined;
    }
  }


  async addMovieToComments(id1: string) {
    const url = 'http://localhost:4000/Comments';

    const movie: any = {
      id: id1,
      comments: []
    };

    try {
      await fetch(url, {
        method: 'POST',
        body: JSON.stringify(movie),
        headers: { 'content-type': 'application/json' }
      })


    } catch (error) {

      console.log(error);

    }

  }


  async getMovies(): Promise<Comment[] | undefined> {

    try {
      const result = await fetch('http://localhost:4000/Comments');
      const Movies = result.json();
      return Movies;

    } catch (error) {

      console.log(error);
      return undefined;

    }


  }


  async addCommentToMovie(userComment: UserComment, movieID: string) {

    try {
      const movies: any = await this.getMovies();

      if (movies) {
        for (let movie of movies) {

          if (movieID == movie.id) {

            movie.comments.push(userComment);

            try {

              await fetch('http://localhost:4000/Comments/' + movieID, {
                method: 'PUT',
                body: JSON.stringify(movie),
                headers: { 'content-type': 'application/json' }
              })


              return true;
            } catch (error) {

              console.log(error);

              return false;

            }
          }
        }
        return false;
      }
      else {
        return undefined
      }
    }
    catch (error) {
      console.log(error);
      return undefined;
    }

  }

  getComments(id: string): Observable<any> {
    const url = "http://localhost:4000/Comments/" + id;
    return this.httpClient.get<any>(url);
  }


  async addMovie(id1: string) {

    const movie: any = {
      id: id1,
      comments: []
    }

    try {
      await fetch('http://localhost:4000/Comments/', {
        method: 'POST',
        body: JSON.stringify(movie),
        headers: { 'content-type': 'application/json' }
      })


    } catch (error) {

      console.log(error);

    }

  }


  async DeleteComment(user: string, movieID: string) {

    try {
      const movies: any = await this.getMovies();

      if (movies) {
        for (let movie of movies) {

          if (movieID == movie.id) {


            if (movie.comments.some((comment: { user: string; }) => comment.user === user)) {
             
              movie.comments = movie.comments.filter((comment: { user: any; }) => comment.user !== user);

              try {

                await fetch('http://localhost:4000/Comments/' + movieID, {
                  method: 'PUT',
                  body: JSON.stringify(movie),
                  headers: { 'content-type': 'application/json' }
                })


                return true;
              } catch (error) {

                console.log(error);

                return false;

              }
            }
          }
        }
        return false;
      }
      else {
        return undefined
      }
    }
    catch (error) {
      console.log(error);
      return undefined;
    }

  }


}


