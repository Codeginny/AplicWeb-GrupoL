export interface CreateTareaDTO {
    descripcion: string;
    prioridad?: 'Alta' | 'Media' | 'Baja' | null;
    responsable?: string | null;
    fechaEntrega?: string | null;
    idColumna?: number | null;
}