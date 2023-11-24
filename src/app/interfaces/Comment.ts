import { UserComment } from "./UserComment";

export interface Comment {/*Interfaz que contiene su id y un arreglo con multiples comentarios de usuarios.*/
    id: string;
    comments: UserComment[];
}