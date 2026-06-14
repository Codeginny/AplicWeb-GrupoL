import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString, IsNotEmpty, IsNumber } from "class-validator";
import { EstadosProyectosEnum } from "../../enums/estados-proyectos.enum";

export class UpdateProyectoDto {

    @ApiProperty({ required: false })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    nombre?: string;

    @ApiProperty({ required: false, nullable: true })
    @IsNumber()
    @IsOptional()
    idCliente?: number | null;

    @ApiProperty({
        enum: EstadosProyectosEnum,
        example: EstadosProyectosEnum.ACTIVO,
        required: false
    })
    @IsEnum(EstadosProyectosEnum)
    @IsOptional()
    estado?: EstadosProyectosEnum;

}