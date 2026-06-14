import { ListTareaDTO } from "./list-tarea-dto";

export interface ColumnaDTO {
    id: number;
    nombre: string;
    orden: number;
    tareas: ListTareaDTO[];
}
