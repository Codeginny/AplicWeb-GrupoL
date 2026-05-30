import { Component, effect, inject, OnInit, signal, WritableSignal } from "@angular/core";
import { MessageService } from "primeng/api";
import { ListProyectoDTO } from "./list-proyecto-dto";
import { ProyectosListadoApiClient } from "./proyectos-listado-api-client";
import { TableModule } from 'primeng/table';
import { ButtonModule } from "primeng/button";
import { Template } from "../../template/template";
import { TooltipModule } from 'primeng/tooltip';
import { GestionProyecto } from "../gestion/gestion-proyecto";
import * as XLSX from 'xlsx';


@Component({
  selector: "app-proyectos-listado",
  templateUrl: "./proyectos-listado.html",
  styleUrls: ["./proyectos-listado.css"],
  imports: [TableModule, ButtonModule, Template, TooltipModule, GestionProyecto]
})
export class ProyectosListado implements OnInit {

  private readonly messageService: MessageService = inject(MessageService);

  private readonly proyectosListadoApiClient: ProyectosListadoApiClient = inject(ProyectosListadoApiClient);

  proyectos: WritableSignal<ListProyectoDTO[]> = signal([]);

  dialogVisible: WritableSignal<boolean> = signal(false);

  proyectoSeleccionado: WritableSignal<ListProyectoDTO | null> = signal<ListProyectoDTO | null>(null);

  constructor() {
    effect(() => {
      if (!this.dialogVisible()) {
        this.refrescarProyectos();
      }
    });
  }

  ngOnInit(): void {
    this.refrescarProyectos();
  }

  refrescarProyectos(): void {
    this.proyectosListadoApiClient.buscarProyectos().subscribe({
      next: (data) => {
        this.proyectos.set(data);
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener los proyectos' });
      }
    });
  }

  crearProyecto(): void {
    this.dialogVisible.set(true);
  }

  editarProyecto(proyecto: ListProyectoDTO): void {
    this.dialogVisible.set(true);
    this.proyectoSeleccionado.set(proyecto);
  }

  gestionarTareas(proyecto: ListProyectoDTO): void {
    window.open(`/proyectos/${proyecto.id}/tareas`, '_blank');
  }

  //  Exportar a Excel
  exportarExcel(): void {
  const proyectos = this.proyectos();
  
  // Mapear los datos a un formato plano para Excel
  const datosExcel = proyectos.map(proyecto => ({
    'Nombre': proyecto.nombre,
    'Cliente': proyecto.cliente?.nombre || 'Sin asignar',
    'Estado': proyecto.estado
  }));

  // Crear hoja de trabajo y libro
  const worksheet = XLSX.utils.json_to_sheet(datosExcel);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Proyectos');

  // Generar archivo y forzar descarga
  XLSX.writeFile(workbook, `proyectos_${new Date().toISOString().slice(0,19)}.xlsx`);
}

//exportacion a CSV
exportarCSV(): void {
  const proyectos = this.proyectos();
  
  // Mapear los datos a un formato plano para CSV
  const datosCSV = proyectos.map(proyecto => ({
    'Nombre': proyecto.nombre,
    'Cliente': proyecto.cliente?.nombre || 'Sin asignar',
    'Estado': proyecto.estado
  }));

  // Convertir a CSV
  const csvData = this.convertirACSV(datosCSV);
  
  // Crear blob y descargar
  const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });// Crear un nuevo Blob con el contenido CSV y el tipo MIME adecuado para archivos CSV. Esto prepara los datos para su descarga como un archivo.
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `proyectos_${new Date().toISOString().slice(0,19)}.csv`);
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

}