import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class LoginDto {

    @ApiProperty()
    @IsString({message: "El nombre debe ser una cadena de texto"})
    @IsNotEmpty({message: "El nombre no puede estar vacío"})
    nombre!:string
    
    @ApiProperty()
    @IsString({message: "La clave debe ser una cadena de texto"})
    @IsNotEmpty({message: "La clave no puede estar vacía"})
    clave!:string

}
