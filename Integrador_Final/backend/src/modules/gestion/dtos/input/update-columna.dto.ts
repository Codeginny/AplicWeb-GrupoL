import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsNumber, IsString } from "class-validator";

export class UpdateColumnaDto {
    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    nombre?: string;

    @ApiProperty({ required: false })
    @IsNumber()
    @IsOptional()
    orden?: number;
}
