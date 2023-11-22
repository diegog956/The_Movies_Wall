import { Component, OnInit } from '@angular/core';
import { DataAPIService } from 'src/app/services/data-api.service';
import { DomSanitizer } from '@angular/platform-browser';
import { UsersDatabaseService } from 'src/app/services/users-database.service';
import { Movie } from 'src/app/interfaces/Movie';
import { UserComment } from 'src/app/interfaces/UserComment';
import { Comment } from '@angular/compiler';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { BehaviorSubject } from 'rxjs';



@Component({
  selector: 'app-movie-page',
  templateUrl: './movie-page.component.html',
  styleUrls: ['./movie-page.component.css']
})
export class MoviePageComponent implements OnInit {
  user!: string;
  txtEnviar: string = 'Enviar';
  valorInput: string = '';
  txtFav1: string = 'Añadir a ';
  txtFav2: string = 'Favoritos';
  commentsArray: UserComment[] = [];
  comment!: Comment;
  loading!: boolean;
  tinyloading!: boolean;
  newUrl: string = '';
  id: string = '';
  Title: string = '';
  Rating: number = 0;
  Votes: string = '';
  Genre: string = '';
  ReleaseDate: string = '';
  Plot: string = '';
  RunTime: number = 0;
  Img: string = '';
  GenreArray: Array<any> = [];
  constructor(private apiService: DataAPIService, private sanitizer: DomSanitizer, private userService: UsersDatabaseService) { }
  TrailerSafe!: any;
  UnsafeTrailer!: string;
  GenreStats: Array<any> = [];
  async ngOnInit() {
    const aux = localStorage.getItem('name');
    if(aux){
      this.user = aux;
    }

    const segments = window.location.pathname.split('/');
    const idString = segments.pop();
    this.id = idString || '';


    this.newUrl = 'https://moviesdatabase.p.rapidapi.com/titles/' + this.id + '?info=base_info';
    this.loading = true;
    this.apiService.getData(this.newUrl).subscribe(movie => {
      console.log(movie);
      this.loading = false;
      this.Title = movie.results.titleText.text;
      this.Rating = movie.results.ratingsSummary.aggregateRating;

      const numeroFormateado = new Intl.NumberFormat().format(movie.results.ratingsSummary.voteCount);
      console.log(numeroFormateado);

      this.Votes = numeroFormateado;

      this.GenreArray = movie.results.genres.genres;

      this.GenreArray.forEach(element => {
        this.GenreStats.push(element);
        this.Genre += element.text + ' / ';
      });
      console.log(this.GenreStats);
      this.Genre = this.Genre.slice(0, -2);

      this.ReleaseDate = movie.results.releaseDate.day + '/' + movie.results.releaseDate.month + '/' + movie.results.releaseDate.year;

      this.apiService.translateText(movie.results.plot.plotText.plainText).subscribe(plot => {

        this.Plot = plot;

      })

      this.RunTime = (movie.results.runtime.seconds) / 60;


      this.Img = movie.results.primaryImage.url;




      this.newUrl = 'https://moviesdatabase.p.rapidapi.com/titles/' + this.id + '?info=trailer';
      this.tinyloading = true;
      this.apiService.getData(this.newUrl).subscribe(trailer => {
        this.tinyloading = false;
        this.UnsafeTrailer = trailer.results.trailer;
        this.TrailerSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.UnsafeTrailer);

      })
    })
    const idUser = localStorage.getItem('id');
    if (idUser) {

      const response = await this.userService.MovieSearch(idUser.toString(), this.id)

      if (response) {

        this.txtFav1 = 'Añadido ✓'
        this.txtFav2 = '';
      }
    }

    const CommentsResult = await this.userService.getUserAndComment(this.id);

    if (CommentsResult) {


      this.commentsArray = CommentsResult.comments;


    }



  }

  addFavorite() {
    if (this.txtFav1 == 'Añadir a ') {
      this.txtFav1 = 'Añadido ✓'
      this.txtFav2 = '';

      const movie: Movie = {
        id: this.id,
        primaryImage: {
          url: this.Img
        }
      };
      const idUser = localStorage.getItem('id');
      if (idUser) {
        this.userService.addFavMovieToUser(idUser.toString(), movie)
      }

      this.userService.addGenre(this.GenreStats);

    } else {

      this.txtFav1 = 'Añadir a'
      this.txtFav2 = 'Favoritos';

      const idUser = localStorage.getItem('id');
      if (idUser) {
        this.userService.removeMovieFromFavorites(idUser.toString(), this.id);
      }

      this.userService.removeGenre(this.GenreStats);
    }
  }

  handleImageError(event: any) {
    event.target.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png';
  }

  async SendComment() {
    const username = localStorage.getItem('name') ?? 'Usuario Anónimo';
    const MC: UserComment = {
      user: username,
      comment: this.valorInput,
      date: format(new Date(), "EEEE, dd 'de' MMMM 'de' yyyy HH:mm:ss", { locale: es })

    }
    let flag:number = 0;
    const allMovies: any = await this.userService.getMovies();
    if (allMovies) {
      for (let movie of allMovies) {

        if (movie.id == this.id) {/*Si la pelicula existe en la bdd de comentarios*/
          flag = 1;
          if (movie.comments.some((comment: any) => comment.user === username)) {


            alert('Usted ya ha realizado un comentario. Solo se permite un comentario por usuario.');

          } else {

            await this.userService.addCommentToMovie(MC, this.id);

            this.userService.getComments(this.id).subscribe((commentsResult) => {
              this.commentsArray = commentsResult.comments;
              console.log('CommentArray:', this.commentsArray);
            });
            this.txtEnviar = 'Enviado ✓';
            this.valorInput = '';
            setTimeout(()=> {this.txtEnviar='Enviar'},3000)
          } /*Plantear la creacion de un Boton para borrar comentario del usuario. */

        } 

      }
      if(flag==0){
        await this.userService.addMovie(this.id);
          
          await this.userService.addCommentToMovie(MC, this.id);



          this.userService.getComments(this.id).subscribe((commentsResult) => {
            this.commentsArray = commentsResult.comments;
            console.log('CommentArray:', commentsResult);
          });
          this.txtEnviar = 'Enviado ✓'
          this.valorInput = '';
          setTimeout(()=> {this.txtEnviar='Enviar'},3000)
      }

    }

  }


  async DeleteComment(user: string){

      await this.userService.DeleteComment(user, this.id);

      this.userService.getComments(this.id).subscribe((commentsResult) => {
        this.commentsArray = commentsResult.comments;
        console.log('CommentArray:', commentsResult);
      });

  }


}
