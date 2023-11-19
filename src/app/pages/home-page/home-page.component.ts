import { AfterViewInit, Component, OnInit } from '@angular/core';
import { DataAPIService } from 'src/app/services/data-api.service';
import { ActivatedRoute } from '@angular/router';
import { UsersDatabaseService } from 'src/app/services/users-database.service';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit{
  NoSearch: boolean = false;
  NoFavorites: boolean = false;
  statButton: boolean = false;
  numpage: number = 1;
  currentGenre!: string;
  prevPage!: number;
  nextPage!: number;
  header: string = '¡Bienvenido!';

  loading!: boolean;

  data: any[] = [];


  userEmail!: string | null;

  valorInput: string = '';


  currentURL!: string;

  needButton!: boolean;
  buttonNextPrevPage!: boolean;


  constructor(private apiService: DataAPIService, private route: ActivatedRoute, private userService: UsersDatabaseService) { }
  
  
  
   ngOnInit() {
   
    this.NoFavorites = false;
    this.NoSearch = false;
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    this.userEmail = localStorage.getItem('userEmail');

    if (isLoggedIn && this.userEmail == 'diego@gmail.com') {
      this.statButton = true;

    } else {
      this.statButton = false;
    }

    this.ListMovies();
    
    
  }

  ListMovies() {
    
    this.NoFavorites = false;
    this.NoSearch = false;
    this.loading = true;

    this.apiService.getData('https://moviesdatabase.p.rapidapi.com/titles/random?titleType=movie&limit=21&info=base_info&endYear=2022&list=most_pop_movies').subscribe(data => {
      console.log('Datos cargados exitosamente:', data);
      this.data = data.results; 
      this.numpage = data.page;
      this.loading = false;
      this.needButton = false;
      this.header = 'Inicio';
     
      
    })


  }

  ListMovieByGenre(genre: string, header: string, page: number) {
    this.NoFavorites = false;
    this.NoSearch = false;
    if (page > 0) {
      this.loading = true;
      this.header = header;
      this.data = [];
      window.scrollTo({ top: 0, behavior: 'smooth' });
      let newUrl = 'https://moviesdatabase.p.rapidapi.com/titles?genre=' + genre + '&titleType=movie&list=most_pop_movies&sort=pos.incr&page=' + page + '&info=base_info&endYear=2022&limit=21';

      this.apiService.getData(newUrl).subscribe(data => {

        this.data = data.results;
        this.loading = false;

        this.needButton = true;
        this.buttonNextPrevPage = true;
        this.numpage = data.page;


        console.log(this.needButton);
        console.log(this.buttonNextPrevPage);

        this.currentURL = newUrl;
        this.currentGenre = genre;

        if (this.numpage != 1) {
          this.prevPage = parseInt(data.page) - 1;

        } else {
          this.prevPage = 0;
        }
        this.nextPage = parseInt(data.page) + 1;

       
      })
    } else {
      this.ListMovieByGenre(genre, header, 1);
    }
  }

  ListMovieByCriteria(url: string, header: string, page: number) {
    this.NoFavorites = false;
    this.NoSearch = false;
    if (page > 0) {
      this.header = header;
      this.loading = true;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (header == 'Proximos Estrenos') {

        url = url + page;

      } else {

        url = 'https://moviesdatabase.p.rapidapi.com/titles?titleType=movie&list=top_boxoffice_200&sort=pos.incr&page=' + page + '&info=base_info&limit=21';

      }

      this.apiService.getData(url).subscribe(data => {

        this.data = data.results;
        this.loading = false;
        this.numpage = data.page;

        this.needButton = true;
        this.buttonNextPrevPage = false;

        this.currentURL = url;


        if (this.numpage != 1) {
          this.prevPage = parseInt(data.page) - 1;

        } else {
          this.prevPage = 0;
        }
        this.nextPage = parseInt(data.page) + 1;

       
      })
    }else{
      this.ListMovieByCriteria(url, header, 1);
    }
  }

  async listFavorites() {
    this.NoSearch = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      if (this.userEmail) {
        const user = await this.userService.getUser(this.userEmail);

        if (user) {
          this.loading = false;
          this.data = user.FavMovies;
          this.header = 'Mis Favoritos'
          this.needButton = false;
        }
      }

    } catch (error) {

    }
    console.log(this.data);
    if(this.data.length == 0){
     
      this.NoFavorites = true;
      this.ListRandomMovies();
      
    }
    this.numpage = 1;
   
  }


  ScrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }


  LogOut() {
    localStorage.clear();
  }

  Search() {
    this.NoFavorites = false;
    this.NoSearch = false;
    this.header = this.valorInput;
    this.loading = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const url = 'https://moviesdatabase.p.rapidapi.com/titles/search/title/' + this.valorInput;


    this.apiService.getSearchData(url).subscribe(data => {

      this.data = data.results;
      this.numpage = data.page;
      this.loading = false;

      console.log('Data1: ', this.data);
      console.log('Data LENGHT1: ', this.data.length)
      
      if(this.data.length == 0 || this.data == null){
        console.log('Data2: ', this.data);
        console.log('Data LENGHT2: ', this.data.length)
        this.NoSearch = true;
              
      }

    })
    this.valorInput = '';
    
   


  }



  ListRandomMovies() {
    this.NoSearch = false;
    this.NoFavorites = true;
    this.loading = true;

    this.apiService.getData('https://moviesdatabase.p.rapidapi.com/titles/random?titleType=movie&limit=3&info=base_info&endYear=2022&list=top_boxoffice_200').subscribe(data => {
      console.log('Datos cargados exitosamente:', data);
      this.data = data.results; 
      this.numpage = data.page;
      this.loading = false;
      this.needButton = false;
      this.header = 'Inicio';
     
      
    })


  }


  
handleImageError(event: any) {
  event.target.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png';
}
}





