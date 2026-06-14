import { Component, computed, effect, inject, input, InputSignal, model, ModelSignal, Signal, signal, WritableSignal } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { DialogModule } from "primeng/dialog";
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { MessageService } from "primeng/api";
import { GestionTareaApiClient } from "./gestion-tarea-api-client";
import { ButtonModule } from "primeng/button";
import { ListTareaDTO } from "../listado/list-tarea-dto";
import { EstadosTareasEnum } from "../estados-tareas-enum";
import { UpdateTareaDto } from "./update-tarea-dto";
import { CreateTareaDTO } from "./create-tarea-dto";
import { ColumnaDTO } from "../listado/columna-dto";

@Component({
    selector: "app-gestion-tarea",
    templateUrl: "./gestion-tarea.html",
    styleUrls: ["./gestion-tarea.css"],
    imports: [DialogModule, InputTextModule, SelectModule, ButtonModule, ReactiveFormsModule]
})
export class GestionTarea {

    visible: ModelSignal<boolean> = model(false);

    tareaSeleccionada: ModelSignal<ListTareaDTO | null> = model<ListTareaDTO | null>(null);

    columnas: InputSignal<ColumnaDTO[]> = input<ColumnaDTO[]>([]);

    private readonly messageService: MessageService = inject(MessageService);

    private readonly gestionTareaApiClient = inject(GestionTareaApiClient);

    readonly idProyecto: InputSignal<number | null> = input<number | null>(null);

    header: Signal<string> = computed(() => {
        if (this.tareaSeleccionada()) {
            return "Editar tarea";
        }
        return "Crear tarea";
    });

    readonly prioridades: string[] = ["Baja", "Media", "Alta"];

    readonly form: FormGroup = new FormGroup({
        descripcion: new FormControl("", [Validators.required]),
        idColumna: new FormControl(null),
        prioridad: new FormControl(null),
        responsable: new FormControl(""),
        fechaEntrega: new FormControl(null)
    });

    constructor() {
        effect(() => {
            if (this.tareaSeleccionada()) {
                this.form.patchValue({
                    descripcion: this.tareaSeleccionada()?.descripcion,
                    idColumna: this.tareaSeleccionada()?.idColumna || null,
                    prioridad: this.tareaSeleccionada()?.prioridad || null,
                    responsable: this.tareaSeleccionada()?.responsable || "",
                    fechaEntrega: this.tareaSeleccionada()?.fechaEntrega || null
                });
            }
            else {
                this.form.reset({
                    descripcion: "",
                    idColumna: null,
                    prioridad: null,
                    responsable: "",
                    fechaEntrega: null
                });
            }
        });
    }

    cerrarDialog(): void {
        this.tareaSeleccionada.set(null);
        this.form.reset({
            descripcion: "",
            idColumna: null,
            prioridad: null,
            responsable: "",
            fechaEntrega: null
        });
        this.visible.set(false);
    }

    guardarTarea(): void {
        if (!this.form.valid) {
            this.form.markAllAsTouched();
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Por favor, complete todos los campos requeridos.' });
            return;
        }

        const formRawValue = this.form.getRawValue();

        if (this.tareaSeleccionada()) {
            const dto: UpdateTareaDto = {
                descripcion: formRawValue.descripcion,
                idColumna: formRawValue.idColumna || null,
                prioridad: formRawValue.prioridad === null || formRawValue.prioridad === undefined ? null : formRawValue.prioridad,
                responsable: formRawValue.responsable === null || formRawValue.responsable === undefined ? null : formRawValue.responsable,
                fechaEntrega: formRawValue.fechaEntrega === null || formRawValue.fechaEntrega === undefined ? null : formRawValue.fechaEntrega,
                estado: formRawValue.estado,
                idMetaIntermedia: this.tareaSeleccionada()?.idMetaIntermedia || null
            };
            this.gestionTareaApiClient.actualizarTarea(this.idProyecto(), this.tareaSeleccionada()?.id!, dto).subscribe({
                next: () => {
                    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Tarea actualizada correctamente.' });
                    this.cerrarDialog();
                },
                error: (err) => {
                    let detail: string = "";
                    if (err.error.statusCode >= 400 && err.error.statusCode < 500) {
                        detail = err.error.message
                    }
                    else {
                        detail = "Ha ocurrido un error al actualizar la tarea"
                    }
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: detail });
                }
            });
        } else {
            const dto: CreateTareaDTO = {
                descripcion: formRawValue.descripcion,
                prioridad: formRawValue.prioridad || undefined,
                responsable: formRawValue.responsable || undefined,
                fechaEntrega: formRawValue.fechaEntrega || undefined,
                idColumna: formRawValue.idColumna || (this.columnas().length > 0 ? this.columnas()[0].id : null)
            };
            this.gestionTareaApiClient.crearTarea(this.idProyecto(), dto).subscribe({
                next: () => {
                    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Tarea creada correctamente.' });
                    this.cerrarDialog();
                },
                error: (err) => {
                    let detail: string = "";
                    if (err.error.statusCode >= 400 && err.error.statusCode < 500) {
                        detail = err.error.message
                    }
                    else {
                        detail = "Ha ocurrido un error al crear la tarea"
                    }
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: detail });
                }
            });
        }
    }

}