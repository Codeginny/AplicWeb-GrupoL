import { ApiProperty } from "@nestjs/swagger";
import { EstadosTareasEnum } from "../../enums/estados-tareas.enum";

export class ListTareaDTO {

    @ApiProperty()
    id!: number;

    @ApiProperty()
    descripcion!: string;

    @ApiProperty()
    estado!: EstadosTareasEnum | null;

    @ApiProperty({ required: false })
    idColumna?: number | null;

    @ApiProperty({ required: false })
    prioridad?: "Alta" | "Media" | "Baja" | null;

    @ApiProperty({ required: false })
    responsable?: string | null;

    @ApiProperty({ required: false })
    fechaEntrega?: string | null;
    
    @ApiProperty({ required: false, nullable: true }) 
    idMetaIntermedia?: number | null;

