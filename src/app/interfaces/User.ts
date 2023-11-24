export interface User{ /*Usuario con atributos de interes a almacenar en la base de datos.*/
    id: number,
    Name: string;
    Email: string;
    Password: string;
    BirthDate: string;
    Country: string;
    FavMovies: Array<any>;

}