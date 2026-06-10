import { Component, computed, effect, inject, model, ModelSignal, output, signal, WritableSignal } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { DialogModule } from "primeng/dialog";
import { InputTextModule } from "primeng/inputtext";
import { MessageService } from "primeng/api";
import { TextareaModule } from "primeng/textarea";
import { ListMetaIntermediaDTO } from "../listado/list-meta-intermedia.dto";
import { GestionMetaIntermediaApiClient } from "./gestion-meta-intermedia-api-client";
import { UpdateMetaIntermediaDTO } from "./update-meta-intermedia.dto";
import { CreateMetaIntermediaDTO } from "./create-meta-intermedia.dto";

@Component({
    selector: "app-gestion-meta-intermedia",
    standalone: true,
    imports: [DialogModule, InputTextModule, TextareaModule, ButtonModule, ReactiveFormsModule],
    templateUrl: "./gestion-meta-intermedia.html",
    styleUrls: ["./gestion-meta-intermedia.css"]
})
export class GestionMetaIntermedia {
    visible: ModelSignal<boolean> = model(false);
    idProyecto = model<number>(0);
    metaSeleccionada = model<ListMetaIntermediaDTO | null>(null);

    private readonly messageService = inject(MessageService);
    private readonly apiClient = inject(GestionMetaIntermediaApiClient);

    header = computed(() => this.metaSeleccionada() ? "Editar meta intermedia" : "Crear meta intermedia");

    form = new FormGroup({
        nombre: new FormControl<string>("", [Validators.required]),
        descripcion: new FormControl("")
    });

    readonly metaGuardada = output<void>();

    constructor() {
        effect(() => {
            const meta = this.metaSeleccionada();
            if (meta) {
                this.form.patchValue({
                    nombre: meta.nombre,
                    descripcion: meta.descripcion || ""
                });
            } else {
                this.form.reset({ nombre: "", descripcion: "" });
            }
        });
    }

    guardar(): void {
        if (!this.form.valid) {
            this.messageService.add({ severity: "error", summary: "Error", detail: "Complete el nombre de la meta." });
            return;
        }

        const raw = this.form.getRawValue();
        const proyectoId = this.idProyecto();

        if (this.metaSeleccionada()) {
            const dto: UpdateMetaIntermediaDTO = {
                nombre: raw.nombre!,
                descripcion: raw.descripcion || undefined
            };
            this.apiClient.actualizarMetaIntermedia(proyectoId, this.metaSeleccionada()!.id, dto).subscribe({
                next: () => {
                    this.messageService.add({ severity: "success", summary: "Éxito", detail: "Meta actualizada." });
                    this.metaGuardada.emit();
                    this.cerrar();
                },
                error: () => this.messageService.add({ severity: "error", summary: "Error", detail: "No se pudo actualizar." })
            });
        } else {
            const dto: CreateMetaIntermediaDTO = {
                nombre: raw.nombre!,
                descripcion: raw.descripcion || undefined
            };
            this.apiClient.crearMetaIntermedia(proyectoId, dto).subscribe({
                next: () => {
                    this.messageService.add({ severity: "success", summary: "Éxito", detail: "Meta creada." });
                    this.metaGuardada.emit();
                    this.cerrar();
                },
                error: () => this.messageService.add({ severity: "error", summary: "Error", detail: "No se pudo crear." })
            });
        }
    }

    cerrar(): void {
        this.metaSeleccionada.set(null);
        this.visible.set(false);
    }
}