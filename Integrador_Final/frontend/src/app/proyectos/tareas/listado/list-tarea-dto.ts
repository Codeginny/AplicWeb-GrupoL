import { EstadosTareasEnum } from "../estados-tareas-enum";

export interface ListTareaDTO{
    id: number;
    descripcion: string;
    estado: EstadosTareasEnum | null;
    idColumna?: number | null;
    prioridad?: 'Alta' | 'Media' | 'Baja' | null;
    responsable?: string | null;
    fechaEntrega?: string | null;
    idMetaIntermedia?: number | null;
}