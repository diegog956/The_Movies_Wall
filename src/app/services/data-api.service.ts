
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class DataAPIService {

  arreglo: any[] = [1, 2, 3];

  constructor(private http: HttpClient) { }

  getData(url: string): Observable<any> {

    const headers = {
      'X-RapidAPI-Key': '926e6df793msh0ea9d04f76400bdp11e7f3jsn10abb3666698',
      'X-RapidAPI-Host': 'moviesdatabase.p.rapidapi.com'
    };


    return this.http.get<any>(url, { headers });
  }

  translateText(text: string): Observable<any> {
    const url = 'https://rapid-translate-multi-traduction.p.rapidapi.com/t';
    const body = {
      from: 'en',
      to: 'es',
      q: text
    };
    const headers = new HttpHeaders({
      'content-type': 'application/json',
      'X-RapidAPI-Key': '926e6df793msh0ea9d04f76400bdp11e7f3jsn10abb3666698',
      'X-RapidAPI-Host': 'rapid-translate-multi-traduction.p.rapidapi.com'
    });

    return this.http.post<any>(url, body, { headers });
  }


  getSearchData(url: string): Observable<any> {

    const headers = {
      'X-RapidAPI-Key': '926e6df793msh0ea9d04f76400bdp11e7f3jsn10abb3666698',
      'X-RapidAPI-Host': 'moviesdatabase.p.rapidapi.com'
    };

    const params = {
    exact: 'false',
    info: 'base_info',
    page: '1',
    //sort: 'pos.incr',
    endYear: '2022',
    titleType: 'movie',
    limit: '21',
    list: 'most_pop_movies'
    };

    
    return this.http.get<any>(url, {params, headers });
  }


}

