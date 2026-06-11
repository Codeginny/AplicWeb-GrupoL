import { Component, computed, effect, inject, OnInit, Signal, signal, WritableSignal } from "@angular/core";
import { MessageService } from "primeng/api";
import { ListTareaDTO } from "./list-tarea-dto";
import { TableModule } from 'primeng/table';
import { ButtonModule } from "primeng/button";
import { Template } from "../../../template/template";
import { TooltipModule } from 'primeng/tooltip';
import { GestionTarea } from "../gestion/gestion-tarea";
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from "@angular/router";
import { ProyectoApiClient } from "./proyecto-api-client";
import { ProyectoDTO } from "./proyecto-dto";
import * as XLSX from 'xlsx';

import { GestionMetaIntermediaApiClient } from "../../meta-intermedia/gestion/gestion-meta-intermedia-api-client";
import { ListMetaIntermediaDTO } from "../../meta-intermedia/listado/list-meta-intermedia.dto";
import { UpdateTareaDto } from "../gestion/update-tarea-dto";
import { GestionTareaApiClient } from "../gestion/gestion-tarea-api-client";
import { SelectModule } from 'primeng/select';
import { ListMetaIntermedia } from "../../meta-intermedia/listado/list-meta-intermedia";

@Component({
  selector: "app-tareas-listado",
  templateUrl: "./tareas-listado.html",
  styleUrls: ["./tareas-listado.css"],
  imports: [TableModule, ButtonModule, Template, TooltipModule, GestionTarea, FormsModule, SelectModule, ListMetaIntermedia]
})
export class TareasListado implements OnInit {

  private readonly messageService: MessageService = inject(MessageService);

  private readonly proyectoApiClient: ProyectoApiClient = inject(ProyectoApiClient);

  private readonly gestionTarea: GestionTareaApiClient = inject(GestionTareaApiClient);

  private readonly metasIntermediasApiClient = inject(GestionMetaIntermediaApiClient);

  proyecto: WritableSignal<ProyectoDTO | null> = signal(null);

  tareas: Signal<ListTareaDTO[]> = computed(() => {
    return this.proyecto()?.tareas || [];
  });

  metasIntermediasDisponibles = signal<ListMetaIntermediaDTO[]>([]);

  dialogVisible: WritableSignal<boolean> = signal(false);

  dialogMetasIntermediasVisible = signal(false);

  tareaSeleccionada: WritableSignal<ListTareaDTO | null> = signal<ListTareaDTO | null>(null);

  private readonly router: Router = inject(Router);

  readonly idProyecto: WritableSignal<number | null> = signal<number | null>(null);

  private readonly route = inject(ActivatedRoute);

  constructor() {
    effect(() => {
      if (!this.dialogVisible()) {
        this.refreshProyecto();
      }
    });
    effect(() => {
      if (this.idProyecto()) {
        this.cargarMetasIntermedias();
      }
    });

    this.idProyecto.set(Number(this.route.snapshot.paramMap.get('id')));

    if (this.idProyecto() === null) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Id de proyecto no válido' });
      this.router.navigateByUrl("/proyectos");
    }

  }

  ngOnInit(): void {
    this.refreshProyecto();
  }

  refreshProyecto(): void {
    this.proyectoApiClient.buscarProyecto(this.idProyecto()).subscribe({
      next: (data) => {
        this.proyecto.set(data);
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener el proyecto' });
      }
    });
  }

   cargarMetasIntermedias(): void {
    this.metasIntermediasApiClient.obtenerMetasIntermedias(this.idProyecto()!).subscribe({
      next: (data) => this.metasIntermediasDisponibles.set(data),
      error: () => console.error("Error cargando metas intermedias")
    });
  }

  crearTarea(): void {
    this.dialogVisible.set(true);
  }

  editarTarea(tarea: ListTareaDTO): void {
    this.dialogVisible.set(true);
    this.tareaSeleccionada.set(tarea);
  }

  abrirDialog(): void {
    this.dialogVisible.set(true);
  }

  //  Exportar a Excel
  exportarExcel(): void {
  const tareas = this.tareas();
  
  // Mapear los datos a un formato plano para Excel
  const datosExcel = tareas.map(tarea => ({
    'Descripcion': tarea.descripcion,
    'Tarea': tarea.estado
  }));

  // Crear hoja de trabajo y libro
  const worksheet = XLSX.utils.json_to_sheet(datosExcel);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Tareas');

  // Generar archivo y forzar descarga
  XLSX.writeFile(workbook, `tareas${new Date().toISOString().slice(0,19)}.xlsx`);
}

//Exportar a CSV
exportarCSV(): void {
  const tareas = this.tareas();
  
  // Mapear los datos a un formato plano para CSV
  const datosCSV = tareas.map(tarea => ({
    'Descripcion': tarea.descripcion,
    'Estado': tarea.estado
  }));

  // Convertir a CSV
  let csvData = this.convertirACSV(datosCSV);
  
  // Agregar BOM (Byte Order Mark) para caracteres UTF-8
  // Esto es crucial para que Excel y otros programas lean bien los acentos
  const blob = new Blob(['\uFEFF' + csvData], { type: 'text/csv;charset=utf-8;' });
  
  // Crear link y descargar
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `tareas_${new Date().toISOString().slice(0,19)}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}


// Método auxiliar para convertir JSON a CSV
private convertirACSV(data: any[]): string {
  if (!data || data.length === 0) return '';
  
  // Obtener las cabeceras
  const headers = Object.keys(data[0]);
  
  // Crear fila de cabeceras
  const csvRows = [];
  csvRows.push(headers.join(','));
  
  // Crear filas de datos
  for (const row of data) {
    const values = headers.map(header => {
      let value = row[header]?.toString() || '';
      // Escapar comillas dobles y envolver en comillas si contiene comas
      value = value.replace(/"/g, '""');
      if (value.includes(',') || value.includes('"') || value.includes('\n')) {
        value = `"${value}"`;
      }
      return value;
    });
    csvRows.push(values.join(','));
  }
  
  return csvRows.join('\n');
}
  
  asignarMetaIntermedia(tarea: ListTareaDTO, idMeta: number | null): void {
    
    const dto = { idMetaIntermedia: idMeta };
    console.log("Asignando meta intermedia", dto); 

    this.gestionTarea.actualizarTarea(this.idProyecto()!, tarea.id, dto).subscribe({
        next: () => {
          
            const proyectoActual = this.proyecto();
            if (proyectoActual) {
                const tareasActualizadas = proyectoActual.tareas.map(t =>
                    t.id === tarea.id ? { ...t, idMetaIntermedia: idMeta } : t
                );
                this.proyecto.set({ ...proyectoActual, tareas: tareasActualizadas });
            }
            this.messageService.add({ severity: 'success', summary: 'Actualizada', detail: 'Meta asignada correctamente.' });
            this.cargarMetasIntermedias(); 
        },
        error: (err) => {
            console.error(err);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'No se pudo asignar la meta.' });
        }
    });
  }


  abrirGestionMetasIntermedias(): void {
    this.dialogMetasIntermediasVisible.set(true);
  }

  onMetasIntermediasGestionClosed(): void {
    this.cargarMetasIntermedias();
  }

}