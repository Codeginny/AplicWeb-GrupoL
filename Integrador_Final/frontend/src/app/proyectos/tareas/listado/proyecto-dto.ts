import { EstadosProyectosEnum } from "../../../proyectos/estados-proyectos-enum";
import { ListTareaDTO } from "./list-tarea-dto";
import { ColumnaDTO } from "./columna-dto";

export interface ProyectoDTO{
    nombre: string;
    cliente: string;
    estado: EstadosProyectosEnum;
    tareas: ListTareaDTO[];
    columnas: ColumnaDTO[];
}