import { ApiProperty } from "@nestjs/swagger";
import { EstadosProyectosEnum } from "../../enums/estados-proyectos.enum";
import { ListTareaDTO } from "./list-tarea.dto";
import { ListColumnaDTO } from "./list-columna.dto";

export class ProyectoDTO {

    @ApiProperty()
    nombre!: string;

    @ApiProperty()
    estado!: EstadosProyectosEnum;

    @ApiProperty()
    cliente!: string;

    @ApiProperty()
    tareas!: ListTareaDTO[];

    @ApiProperty({ type: ListColumnaDTO, isArray: true })
    columnas!: ListColumnaDTO[];

}