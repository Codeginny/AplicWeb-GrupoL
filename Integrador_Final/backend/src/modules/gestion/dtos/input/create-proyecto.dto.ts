import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateProyectoDto {

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    nombre!: string;

    @ApiProperty()
    @IsNumber()
    //Los proyectos pueden no estar asociados a un cliente, por lo que el ID del cliente es opcional
    @IsOptional()// El ID del cliente es opcional, ya que un proyecto puede no estar asociado a un cliente
    idCliente!: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsDateString()
    fechaFinalizacionObjetivo?: Date;

}