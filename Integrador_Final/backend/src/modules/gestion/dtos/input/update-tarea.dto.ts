import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsEnum, IsOptional } from "class-validator";
import { EstadosTareasEnum } from "../../enums/estados-tareas.enum";
import { CreateTareaDto } from "./create-tarea.dto";
import { Transform } from 'class-transformer';

export class UpdateTareaDto extends PartialType(CreateTareaDto) {

    @ApiProperty({ enum: EstadosTareasEnum, example: EstadosTareasEnum.PENDIENTE })
    @IsEnum(EstadosTareasEnum)
    @IsOptional()
    estado?: EstadosTareasEnum;

    @ApiProperty({ required: false, nullable: true })
    @IsOptional()
    @Transform(({ value }) => value === null ? null : Number(value))
    idMetaIntermedia?: number | null;
}