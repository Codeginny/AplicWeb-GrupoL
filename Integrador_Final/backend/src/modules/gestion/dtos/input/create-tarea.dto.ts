import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, IsIn, IsDateString, IsInt } from "class-validator";

export class CreateTareaDto {

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    descripcion!: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsIn(["Alta", "Media", "Baja"])
    prioridad?: "Alta" | "Media" | "Baja";

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    responsable?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsDateString()
    fechaEntrega?: string;

    @ApiProperty({ required: false, nullable: true })
    @IsOptional()
    @IsInt()
    idColumna?: number | null;

    @ApiProperty({ required: false, nullable: true })
    @IsOptional()
    @IsInt()
    idMetaIntermedia?: number | null;

}