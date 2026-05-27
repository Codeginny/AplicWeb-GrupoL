import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateClienteDto {

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    nombre!: string;


    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    telefono!: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    email!: string;
    

}