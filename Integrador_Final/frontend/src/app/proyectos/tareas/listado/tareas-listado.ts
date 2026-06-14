import { Component, computed, effect, inject, OnInit, Signal, signal, WritableSignal } from "@angular/core";
import { MessageService, ConfirmationService } from "primeng/api";
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ListTareaDTO } from "./list-tarea-dto";
import { ButtonModule } from "primeng/button";
import { TableModule } from 'primeng/table';
import { Template } from "../../../template/template";
import { TooltipModule } from 'primeng/tooltip';
import { GestionTarea } from "../gestion/gestion-tarea";
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from "@angular/router";
import { ProyectoApiClient } from "./proyecto-api-client";
import { ProyectoDTO } from "./proyecto-dto";
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { EstadosTareasEnum } from "../estados-tareas-enum";
import { FiltroTareasPipe } from "./filtro-tareas.pipe";
import { ColumnaDTO } from "./columna-dto";
import { ColumnasApiClient } from "./columnas-api-client";
import { DatePipe, SlicePipe } from "@angular/common";
import * as XLSX from 'xlsx';
import { DialogModule } from 'primeng/dialog';

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
  imports: [TableModule, ButtonModule, Template, TooltipModule, GestionTarea, DragDropModule, FiltroTareasPipe, FormsModule, SelectModule, ListMetaIntermedia, DatePipe, SlicePipe, ConfirmDialogModule, DialogModule],
  providers: [ConfirmationService]

})
export class TareasListado implements OnInit {

  readonly searchQuery: WritableSignal<string> = signal("");

  private readonly messageService: MessageService = inject(MessageService);

  private readonly confirmationService: ConfirmationService = inject(ConfirmationService);

  private readonly proyectoApiClient: ProyectoApiClient = inject(ProyectoApiClient);


  private readonly gestionTareaApiClient: GestionTareaApiClient = inject(GestionTareaApiClient);

  private readonly columnasApiClient: ColumnasApiClient = inject(ColumnasApiClient);


  private readonly metasIntermediasApiClient = inject(GestionMetaIntermediaApiClient);


  proyecto: WritableSignal<ProyectoDTO | null> = signal(null);

  columnas: WritableSignal<ColumnaDTO[]> = signal([]);

  editingColumnaId: WritableSignal<number | null> = signal(null);
  editColumnaNombreValue: WritableSignal<string> = signal("");

  readonly EstadosTareasEnum = EstadosTareasEnum;

  metasIntermediasDisponibles = signal<ListMetaIntermediaDTO[]>([]);

  dialogVisible: WritableSignal<boolean> = signal(false);

  dialogMetasIntermediasVisible = signal(false);

  detalleModalVisible = signal(false);
  tareaDetalleSeleccionada = signal<ListTareaDTO | null>(null);
  editDescripcionValue = signal('');

  tareaSeleccionada: WritableSignal<ListTareaDTO | null> = signal<ListTareaDTO | null>(null);

  private readonly router: Router = inject(Router);

  readonly idProyecto: WritableSignal<number | null> = signal<number | null>(null);

  private readonly route = inject(ActivatedRoute);

   tareas: Signal<ListTareaDTO[]> = computed(() => {
    return this.proyecto()?.tareas || [];
  });

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
        const cols = (data.columnas || []).sort((a, b) => a.orden - b.orden);
        this.columnas.set(cols);
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener el proyecto' });
      }
    });
  }

   cargarMetasIntermedias(): void {
      this.metasIntermediasApiClient.obtenerMetasIntermedias(this.idProyecto()!).subscribe({
          next: (data) => this.metasIntermediasDisponibles.set(
              data.map(m => ({ ...m, id: Number(m.id) }))
          ),
          error: () => console.error("Error cargando metas intermedias")
      });
  }

  crearTarea(): void {
    this.cargarMetasIntermedias();
    this.tareaSeleccionada.set(null);
    this.dialogVisible.set(true);
  }

  editarTarea(tarea: ListTareaDTO): void {
    this.tareaSeleccionada.set(tarea);
    this.metasIntermediasApiClient.obtenerMetasIntermedias(this.idProyecto()!).subscribe({
        next: (data) => {
            const metas = data.map(m => ({ ...m, id: Number(m.id) }));
            this.metasIntermediasDisponibles.set(metas);
            this.dialogVisible.set(true);
        }
    });
  }

  // abrimos la ventana de detalle de la tarea
  abrirDetalleTarea(tarea: ListTareaDTO): void {
    this.tareaDetalleSeleccionada.set(tarea);
    this.editDescripcionValue.set(tarea.descripcion || '');
    this.detalleModalVisible.set(true);
  }

  guardarDetalleTarea(): void {
    const tarea = this.tareaDetalleSeleccionada();
    if (!tarea) return;

    const dto = { 
      descripcion: this.editDescripcionValue(),
      idMetaIntermedia: tarea.idMetaIntermedia || null,
      idColumna: tarea.idColumna || null,
      estado: tarea.estado
    };

    this.gestionTareaApiClient.actualizarTarea(this.idProyecto()!, tarea.id, dto).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Descripción actualizada.' });
        this.detalleModalVisible.set(false);
        this.refreshProyecto();
      },
      error: (err: any) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar.' });
      }
    });
  }

  eliminarTarea(tarea: ListTareaDTO): void {
    this.confirmationService.confirm({
      message: `¿Está seguro de que desea eliminar la tarea "${tarea.descripcion}"?`,
      header: 'Confirmar eliminación',
      icon: '',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'btn-confirm-accept',
      rejectButtonStyleClass: 'btn-confirm-reject',
      accept: () => {
        this.gestionTareaApiClient.eliminarTarea(this.idProyecto(), tarea.id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Tarea eliminada correctamente.' });
            this.refreshProyecto();
          },
          error: (error) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar la tarea' });
          }
        });
      }
    });
  }

  iniciarEdicionColumna(columna: ColumnaDTO): void {
    this.editingColumnaId.set(columna.id);
    this.editColumnaNombreValue.set(columna.nombre);
  }

  guardarEdicionColumna(columnaId: number): void {
    const nuevoNombre = this.editColumnaNombreValue().trim();
    if (!nuevoNombre) {
      this.editingColumnaId.set(null);
      return;
    }
    this.columnasApiClient.actualizarColumna(columnaId, { nombre: nuevoNombre }).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Nombre de columna actualizado.' });
        this.editingColumnaId.set(null);
        this.refreshProyecto();
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar el nombre de la columna.' });
        this.editingColumnaId.set(null);
      }
    });
  }

  // manejamos el evento de arrastrar y soltar
  drop(event: CdkDragDrop<ListTareaDTO[]>, nuevoColumnaId: number): void {
    if (event.previousContainer === event.container) {
      const array = [...event.container.data];
      moveItemInArray(array, event.previousIndex, event.currentIndex);
      
      const cols = this.columnas().map(col => {
        if (col.id === nuevoColumnaId) {
          return { ...col, tareas: array };
        }
        return col;
      });
      this.columnas.set(cols);
    } else {
      const prevArray = [...event.previousContainer.data];
      const currArray = [...event.container.data];
      const tarea = prevArray[event.previousIndex];

      transferArrayItem(
        prevArray,
        currArray,
        event.previousIndex,
        event.currentIndex
      );

      const anteriorColumnaId = Number(event.previousContainer.id);
      const cols = this.columnas().map(col => {
        if (col.id === anteriorColumnaId) {
          return { ...col, tareas: prevArray };
        }
        if (col.id === nuevoColumnaId) {
          return { ...col, tareas: currArray };
        }
        return col;
      });
      this.columnas.set(cols);

      this.actualizarColumnaTarea(tarea, nuevoColumnaId);
    }
  }

  // actualizamos el estado de la tarea en la base de datos
  actualizarColumnaTarea(tarea: ListTareaDTO, nuevoColumnaId: number): void {
    const targetCol = this.columnas().find(c => c.id === nuevoColumnaId);
    let nuevoEstado = EstadosTareasEnum.PENDIENTE;
    if (targetCol) {
      if (targetCol.orden === 2) nuevoEstado = EstadosTareasEnum.EN_PROGRESO;
      else if (targetCol.orden === 3) nuevoEstado = EstadosTareasEnum.FINALIZADA;
    }

    const updateDto = {
      descripcion: tarea.descripcion,
      prioridad: tarea.prioridad || null,
      responsable: tarea.responsable || null,
      fechaEntrega: tarea.fechaEntrega || null,
      idMetaIntermedia: tarea.idMetaIntermedia || null,
      idColumna: Number(nuevoColumnaId),
      estado: nuevoEstado
    };
    
    this.gestionTareaApiClient.actualizarTarea(this.idProyecto(), tarea.id, updateDto).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Estado de la tarea actualizado.' });
        this.refreshProyecto();
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar el estado de la tarea' });
      }
    });
  }

  getMetaNombre(idMeta: number | null | undefined): string {
    if (!idMeta) return '';
    const meta = this.metasIntermediasDisponibles().find(m => m.id === idMeta);
    return meta ? meta.nombre : '';
  }

  getDiasRestantes(fechaEntrega: string | null | undefined): number | null {
    if (!fechaEntrega) return null;
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    // ajustamos el formato de la fecha para evitar problemas con la zona horaria
    const partes = fechaEntrega.split('-');
    if (partes.length === 3) {
      const entrega = new Date(Number(partes[0]), Number(partes[1]) - 1, Number(partes[2].substring(0, 2)));
      entrega.setHours(0, 0, 0, 0);
      const diffTime = entrega.getTime() - hoy.getTime();
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    const entrega = new Date(fechaEntrega);
    entrega.setHours(0, 0, 0, 0);
    const diffTime = entrega.getTime() - hoy.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getTextoPlazo(fechaEntrega: string | null | undefined): string {
    const dias = this.getDiasRestantes(fechaEntrega);
    if (dias === null) return '';
    if (dias < 0) return `Vencida (hace ${Math.abs(dias)} días)`;
    if (dias <= 3) return `Próximo a finalizar (${dias} días)`;
    return 'Al día';
  }

  getClasePlazo(fechaEntrega: string | null | undefined): string {
    const dias = this.getDiasRestantes(fechaEntrega);
    if (dias === null) return '';
    return dias <= 3 ? 'text-red font-semibold' : 'text-green font-semibold';
  }

  abrirDialog(): void {
    this.dialogVisible.set(true);
  }

  exportarExcel(): void {
  const tareas = this.tareas();
  
  // preparamos las columnas para exportar a excel
  const datosExcel = tareas.map((tarea: ListTareaDTO) => ({
    'Título': `Tarea ${tarea.id}`,
    'Descripción': tarea.descripcion,
    'Estado': tarea.estado || 'PENDIENTE',
    'Responsable': tarea.responsable || 'Sin asignar',
    'Prioridad': tarea.prioridad || 'No definida',
    'Fecha de Entrega': tarea.fechaEntrega || 'Sin fecha'
  }));

  const worksheet = XLSX.utils.json_to_sheet(datosExcel);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Tareas');

  // generamos y descargamos el archivo excel
  XLSX.writeFile(workbook, `tareas${new Date().toISOString().slice(0,19)}.xlsx`);
}

exportarCSV(): void {
  const tareas = this.tareas();
  
  // preparamos las columnas para el archivo csv
  const datosCSV = tareas.map((tarea: ListTareaDTO) => ({
    'Título': `Tarea ${tarea.id}`,
    'Descripción': tarea.descripcion,
    'Estado': tarea.estado || 'PENDIENTE',
    'Responsable': tarea.responsable || 'Sin asignar',
    'Prioridad': tarea.prioridad || 'No definida',
    'Fecha de Entrega': tarea.fechaEntrega || 'Sin fecha'
  }));

  let csvData = this.convertirACSV(datosCSV);
  
  // agregamos el BOM para que excel lea bien las tildes
  const blob = new Blob(['\uFEFF' + csvData], { type: 'text/csv;charset=utf-8;' });
  
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
  
  asignarMetaIntermedia(tarea: ListTareaDTO, idMeta: number | null): void {
    
    const dto = { descripcion: tarea.descripcion, idMetaIntermedia: idMeta };

    this.gestionTareaApiClient.actualizarTarea(this.idProyecto()!, tarea.id, dto).subscribe({
        next: () => {
          
            const proyectoActual = this.proyecto();
            if (proyectoActual) {
                const tareasActualizadas = proyectoActual.tareas.map((t: ListTareaDTO) =>
                    t.id === tarea.id ? { ...t, idMetaIntermedia: idMeta } : t
                );
                this.proyecto.set({ ...proyectoActual, tareas: tareasActualizadas });
            }
            this.messageService.add({ severity: 'success', summary: 'Actualizada', detail: 'Meta asignada correctamente.' });
            this.cargarMetasIntermedias(); 
        },
        error: (err: any) => {
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