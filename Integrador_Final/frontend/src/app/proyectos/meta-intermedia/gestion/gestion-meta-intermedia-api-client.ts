import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { CreateMetaIntermediaDTO } from "./create-meta-intermedia.dto";
import { UpdateMetaIntermediaDTO } from "./update-meta-intermedia.dto";
import { ListMetaIntermediaDTO } from "../listado/list-meta-intermedia.dto";

@Injectable({
    providedIn: "root"
})
export class GestionMetaIntermediaApiClient {
    private readonly httpClient: HttpClient = inject(HttpClient);

    crearMetaIntermedia(proyectoId: number, dto: CreateMetaIntermediaDTO) {
        return this.httpClient.post<{ id: number }>(`/api/v1/proyectos/${proyectoId}/metas`, dto);
    }
    actualizarMetaIntermedia(proyectoId: number, metaId: number, dto: UpdateMetaIntermediaDTO) {
        return this.httpClient.put<void>(`/api/v1/proyectos/${proyectoId}/metas/${metaId}`, dto);
    }
    eliminarMetaIntermedia(proyectoId: number, metaId: number) {
        return this.httpClient.delete<void>(`/api/v1/proyectos/${proyectoId}/metas/${metaId}`);
    }
    obtenerMetasIntermedias(proyectoId: number) {
        return this.httpClient.get<ListMetaIntermediaDTO[]>(`/api/v1/proyectos/${proyectoId}/metas`);
    }
}