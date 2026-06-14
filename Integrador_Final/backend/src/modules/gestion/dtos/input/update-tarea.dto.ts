import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsInt, IsString, IsNotEmpty, IsIn, IsDateString } from "class-validator";
import { EstadosTareasEnum } from "../../enums/estados-tareas.enum";

export class UpdateTareaDto {

    @ApiProperty({ required: false })
    @IsString()
    @IsNotEmpty()
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

}