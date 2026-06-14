import { Component, computed, effect, inject, OnInit, Signal, signal, WritableSignal } from "@angular/core";
import { MessageService, ConfirmationService } from "primeng/api";
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ListTareaDTO } from "./list-tarea-dto";
import { ButtonModule } from "primeng/button";
import { Template } from "../../../template/template";
import { TooltipModule } from 'primeng/tooltip';
import { GestionTarea } from "../gestion/gestion-tarea";
import { ActivatedRoute, Router } from "@angular/router";
import { ProyectoApiClient } from "./proyecto-api-client";
import { ProyectoDTO } from "./proyecto-dto";
import { GestionTareaApiClient } from "../gestion/gestion-tarea-api-client";
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { EstadosTareasEnum } from "../estados-tareas-enum";
import { FiltroTareasPipe } from "./filtro-tareas.pipe";
import { FormsModule } from "@angular/forms";
import { ColumnaDTO } from "./columna-dto";
import { ColumnasApiClient } from "./columnas-api-client";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-tareas-listado",
  templateUrl: "./tareas-listado.html",
  styleUrls: ["./tareas-listado.css"],
  imports: [ButtonModule, Template, TooltipModule, GestionTarea, DragDropModule, FiltroTareasPipe, FormsModule, DatePipe, ConfirmDialogModule],
  providers: [ConfirmationService]
})
export class TareasListado implements OnInit {

  readonly searchQuery: WritableSignal<string> = signal("");

  private readonly messageService: MessageService = inject(MessageService);

  private readonly confirmationService: ConfirmationService = inject(ConfirmationService);

  private readonly proyectoApiClient: ProyectoApiClient = inject(ProyectoApiClient);

  private readonly gestionTareaApiClient: GestionTareaApiClient = inject(GestionTareaApiClient);

  private readonly columnasApiClient: ColumnasApiClient = inject(ColumnasApiClient);

  proyecto: WritableSignal<ProyectoDTO | null> = signal(null);

  columnas: WritableSignal<ColumnaDTO[]> = signal([]);

  editingColumnaId: WritableSignal<number | null> = signal(null);
  editColumnaNombreValue: WritableSignal<string> = signal("");

  readonly EstadosTareasEnum = EstadosTareasEnum;

  dialogVisible: WritableSignal<boolean> = signal(false);

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

  crearTarea(): void {
    this.tareaSeleccionada.set(null);
    this.dialogVisible.set(true);
  }

  editarTarea(tarea: ListTareaDTO): void {
    this.dialogVisible.set(true);
    this.tareaSeleccionada.set(tarea);
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

  actualizarColumnaTarea(tarea: ListTareaDTO, nuevoColumnaId: number): void {
    const targetCol = this.columnas().find(c => c.id === nuevoColumnaId);
    let nuevoEstado = EstadosTareasEnum.PENDIENTE;
    if (targetCol) {
      if (targetCol.orden === 2) nuevoEstado = EstadosTareasEnum.EN_PROGRESO;
      else if (targetCol.orden === 3) nuevoEstado = EstadosTareasEnum.FINALIZADA;
    }

    const updateDto = {
      descripcion: tarea.descripcion,
      idColumna: nuevoColumnaId,
      estado: nuevoEstado
    };
    this.gestionTareaApiClient.actualizarTarea(this.idProyecto(), tarea.id, updateDto).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Estado de la tarea actualizado.' });
        this.refreshProyecto();
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar el estado de la tarea' });
        this.refreshProyecto();
      }
    });
  }

  abrirDialog(): void {
    this.dialogVisible.set(true);
  }

}