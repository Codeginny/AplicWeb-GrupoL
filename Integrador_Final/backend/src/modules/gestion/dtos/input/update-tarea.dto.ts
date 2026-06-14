import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsInt, IsString, IsNotEmpty, IsIn, IsDateString } from "class-validator";
import { EstadosTareasEnum } from "../../enums/estados-tareas.enum";
import { CreateTareaDto } from "./create-tarea.dto";
import { Transform } from 'class-transformer';

export class UpdateTareaDto {

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    descripcion?: string;

    @ApiProperty({ required: false, nullable: true })
    @IsOptional()
    @IsIn(["Alta", "Media", "Baja", null])
    prioridad?: "Alta" | "Media" | "Baja" | null;

    @ApiProperty({ required: false, nullable: true })
    @IsOptional()
    @IsString()
    responsable?: string | null;

    @ApiProperty({ required: false, nullable: true })
    @IsOptional()
    @IsDateString()
    fechaEntrega?: string | null;

    @ApiProperty({ enum: EstadosTareasEnum, example: EstadosTareasEnum.PENDIENTE, required: false, nullable: true })
    @IsEnum(EstadosTareasEnum)
    @IsOptional()
    estado?: EstadosTareasEnum | null;

    @ApiProperty({ required: false, nullable: true })
    @IsOptional()
    @IsInt()
    idColumna?: number | null;

    @ApiProperty({ required: false, nullable: true })
    @IsOptional()
    @Transform(({ value }) => value === null || value === undefined ? value : Number(value))
    idMetaIntermedia?: number | null;
}