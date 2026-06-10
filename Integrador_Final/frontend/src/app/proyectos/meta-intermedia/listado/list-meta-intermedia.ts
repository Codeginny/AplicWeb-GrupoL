import { Component, effect, inject, model, ModelSignal, output, signal, WritableSignal } from "@angular/core";
import { ButtonModule } from "primeng/button";
import { DialogModule } from "primeng/dialog";
import { TableModule } from "primeng/table";
import { TooltipModule } from "primeng/tooltip";
import { MessageService } from "primeng/api";
import { ListMetaIntermediaDTO } from "./list-meta-intermedia.dto";
import { GestionMetaIntermediaApiClient } from "../gestion/gestion-meta-intermedia-api-client";
import { GestionMetaIntermedia } from "../gestion/gestion-meta-intermedia";
import { ChangeDetectorRef } from '@angular/core'; 

@Component({
    selector: "app-listado-meta-intermedia",
    standalone: true,
    imports: [DialogModule, TableModule, ButtonModule, TooltipModule, GestionMetaIntermedia],
    templateUrl: "./list-meta-intermedia.html",
    styleUrls: ["./list-meta-intermedia.css"]
})
export class ListMetaIntermedia {
    private readonly cdr = inject(ChangeDetectorRef);

    visible: ModelSignal<boolean> = model(false);
    idProyecto = model<number>(0);

    metas: WritableSignal<ListMetaIntermediaDTO[]> = signal([]);
    dialogGestionVisible = signal(false);
    metaParaEditar = signal<ListMetaIntermediaDTO | null>(null);

    readonly metasCambiadas = output<void>();

    private readonly apiClient = inject(GestionMetaIntermediaApiClient);
    private readonly messageService = inject(MessageService);

    constructor() {
        effect(() => {
            if (this.visible()) {
                this.cargarMetasIntermedias();
            }
        });
    }

    cargarMetasIntermedias(): void {
        this.apiClient.obtenerMetasIntermedias(this.idProyecto()).subscribe({
            next: (data) => {
                 this.metas.set([...data]);
                this.metasCambiadas.emit();
                this.cdr.detectChanges();
            },
            error: () => this.messageService.add({ severity: "error", summary: "Error", detail: "No se pudieron cargar las metas." })
        });
    }

    crearMetaIntermedia(): void {
        this.metaParaEditar.set(null);
        this.dialogGestionVisible.set(true);
    }

    editarMetaIntermedia(meta: ListMetaIntermediaDTO): void {
        this.metaParaEditar.set(meta);
        this.dialogGestionVisible.set(true);
    }

    eliminarMetaIntermedia(meta: ListMetaIntermediaDTO): void {
        if (confirm(`¿Eliminar la meta "${meta.nombre}"?`)) {
            this.apiClient.eliminarMetaIntermedia(this.idProyecto(), meta.id).subscribe({
                next: () => {
                    this.messageService.add({ severity: "success", summary: "Éxito", detail: "Meta eliminada." });
                    this.cargarMetasIntermedias();
                },
                error: (err) => {
                    const msg = err.error?.message || "No se pudo eliminar (tiene tareas asociadas).";
                    this.messageService.add({ severity: "error", summary: "Error", detail: msg });
                }
            });
        }
    }

    onGestionClosed(): void {
        this.dialogGestionVisible.set(false);
    }
}