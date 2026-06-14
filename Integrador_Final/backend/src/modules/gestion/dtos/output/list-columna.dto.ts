import { ApiProperty } from "@nestjs/swagger";
import { ListTareaDTO } from "./list-tarea.dto";

export class ListColumnaDTO {
    @ApiProperty()
    id!: number;

    @ApiProperty()
    nombre!: string;

    @ApiProperty()
    orden!: number;

    @ApiProperty({ type: ListTareaDTO, isArray: true })
    tareas!: ListTareaDTO[];
}
