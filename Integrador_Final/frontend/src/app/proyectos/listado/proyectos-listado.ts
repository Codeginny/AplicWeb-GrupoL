import { Component, effect, inject, OnInit, signal, WritableSignal } from "@angular/core";
import { MessageService } from "primeng/api";
import { ListProyectoDTO } from "./list-proyecto-dto";
import { ProyectosListadoApiClient } from "./proyectos-listado-api-client";
import { TableModule } from 'primeng/table';
import { ButtonModule } from "primeng/button";
import { Template } from "../../template/template";
import { TooltipModule } from 'primeng/tooltip';
import { GestionProyecto } from "../gestion/gestion-proyecto";
import { SelectModule } from "primeng/select";
import { FormsModule } from "@angular/forms";
import { ListClienteDTO } from "../clientes/listado/list-cliente-dto";
import { ClientesListadoApiClient } from "../clientes/listado/clientes-listado-api-client";
import { EstadosClientesEnum } from "../clientes/estados-clientes-enum";
import { GestionProyectoApiClient } from "../gestion/gestion-proyecto-api-client";
import { UpdateProyectoDto } from "../gestion/update-proyecto-dto";
import * as XLSX from 'xlsx';

import { DatePipe } from "@angular/common";

@Component({
  selector: "app-proyectos-listado",
  templateUrl: "./proyectos-listado.html",
  styleUrls: ["./proyectos-listado.css"],
  imports: [TableModule, ButtonModule, Template, TooltipModule, GestionProyecto, DatePipe, SelectModule, FormsModule]

})
export class ProyectosListado implements OnInit {

  private readonly messageService: MessageService = inject(MessageService);

  private readonly proyectosListadoApiClient: ProyectosListadoApiClient = inject(ProyectosListadoApiClient);

  private readonly clientesListadoApiClient: ClientesListadoApiClient = inject(ClientesListadoApiClient);

  private readonly gestionProyectoApiClient: GestionProyectoApiClient = inject(GestionProyectoApiClient);

  proyectos: WritableSignal<ListProyectoDTO[]> = signal([]);

  clientes: WritableSignal<ListClienteDTO[]> = signal([]);

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
    this.refrescarClientes();
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

  refrescarClientes(): void {
    this.clientesListadoApiClient.buscarClientes(EstadosClientesEnum.ACTIVO).subscribe({
      next: (data) => {
        this.clientes.set(data);
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener los clientes' });
      }
    });
  }

  cambiarCliente(proyecto: ListProyectoDTO, event: any): void {
    const nuevoClienteId: number | null = event.value ?? null;

    const dto: UpdateProyectoDto = {
      nombre: proyecto.nombre,
      idCliente: nuevoClienteId,
      estado: proyecto.estado as any
    };

    this.gestionProyectoApiClient.actualizarProyecto(proyecto.id, dto).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Cliente actualizado correctamente.' });
        this.refrescarProyectos();
      },
      error: (err) => {
        let detail = "Error al actualizar el cliente";
        if (err.error?.statusCode >= 400 && err.error?.statusCode < 500) {
          detail = err.error.message;
        }
        this.messageService.add({ severity: 'error', summary: 'Error', detail });
        this.refrescarProyectos();
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

  exportarExcel(): void {
  const proyectos = this.proyectos();
  
  const datosExcel = proyectos.map(proyecto => ({
    'Nombre': proyecto.nombre,
    'Cliente': proyecto.cliente?.nombre || 'Sin asignar',
    'Estado': proyecto.estado
  }));

  const worksheet = XLSX.utils.json_to_sheet(datosExcel);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Proyectos');

  XLSX.writeFile(workbook, `proyectos_${new Date().toISOString().slice(0,19)}.xlsx`);
}

exportarCSV(): void {
  const proyectos = this.proyectos();
  
  const datosCSV = proyectos.map(proyecto => ({
    'Nombre': proyecto.nombre,
    'Cliente': proyecto.cliente?.nombre || 'Sin asignar',
    'Estado': proyecto.estado
  }));

  const csvData = this.convertirACSV(datosCSV);
  
  const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
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

private convertirACSV(data: any[]): string {
  if (!data || data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  
  const csvRows = [];
  csvRows.push(headers.join(','));
  
  for (const row of data) {
    const values = headers.map(header => {
      let value = row[header]?.toString() || '';
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
  getTextoPlazo(proyecto: ListProyectoDTO): string {
    if (!proyecto.fechaFinalizacionObjetivo) return 'Al día';
    if (proyecto.estado === 'FINALIZADO') return 'Completado'; 

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const objetivo = new Date(proyecto.fechaFinalizacionObjetivo);
    objetivo.setHours(0, 0, 0, 0);

    const diffDays = Math.ceil((objetivo.getTime() - hoy.getTime()) / (1000 * 3600 * 24));

    if (diffDays < 0) {
      const retraso = Math.abs(diffDays);
      return `Retrasado ${retraso} día${retraso !== 1 ? 's' : ''}`;
    }
    if (diffDays <= 7) {
      return `Próximo a finalizar (${diffDays} día${diffDays !== 1 ? 's' : ''})`;
    }
    return 'Al día';
  }

  getClasePlazo(proyecto: ListProyectoDTO): string {
    if (!proyecto.fechaFinalizacionObjetivo) return 'plazo-al-dia';
    if (proyecto.estado === 'FINALIZADO') return 'plazo-completado';

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const objetivo = new Date(proyecto.fechaFinalizacionObjetivo);
    objetivo.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((objetivo.getTime() - hoy.getTime()) / (1000 * 3600 * 24));

    if (diffDays < 0) return 'plazo-retrasado';
    if (diffDays <= 7) return 'plazo-proximo';
    return 'plazo-al-dia';
  }

}