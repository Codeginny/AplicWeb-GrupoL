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

@Component({
  selector: "app-proyectos-listado",
  templateUrl: "./proyectos-listado.html",
  styleUrls: ["./proyectos-listado.css"],
  imports: [TableModule, ButtonModule, Template, TooltipModule, GestionProyecto, SelectModule, FormsModule]
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
        this.refrescarProyectos(); // revertir el selector al valor original
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

}