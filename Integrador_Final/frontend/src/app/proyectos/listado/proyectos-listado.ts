import { Component, effect, inject, OnInit, signal, WritableSignal } from "@angular/core";
import { MessageService } from "primeng/api";
import { ListProyectoDTO } from "./list-proyecto-dto";
import { ProyectosListadoApiClient } from "./proyectos-listado-api-client";
import { TableModule } from 'primeng/table';
import { ButtonModule } from "primeng/button";
import { Template } from "../../template/template";
import { TooltipModule } from 'primeng/tooltip';
import { GestionProyecto } from "../gestion/gestion-proyecto";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-proyectos-listado",
  templateUrl: "./proyectos-listado.html",
  styleUrls: ["./proyectos-listado.css"],
  imports: [TableModule, ButtonModule, Template, TooltipModule, GestionProyecto, DatePipe]
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