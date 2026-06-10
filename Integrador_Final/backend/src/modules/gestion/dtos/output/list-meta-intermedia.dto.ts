import { ApiProperty } from "@nestjs/swagger";

export class ListMetaIntermediaDTO {
    @ApiProperty()
    id!: number;
    @ApiProperty()
    nombre!: string;
    @ApiProperty()
    descripcion?: string;
    @ApiProperty()
    idProyecto!: number;
}