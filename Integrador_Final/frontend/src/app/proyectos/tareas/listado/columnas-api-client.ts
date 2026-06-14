import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class ColumnasApiClient {

    private readonly httpClient = inject(HttpClient);


    actualizarColumna(idColumna: number, body: { nombre?: string; orden?: number }): Observable<void> {
        return this.httpClient.patch<void>(`/api/v1/columnas/${idColumna}`, body);
    }

    eliminarColumna(idColumna: number): Observable<void> {
        return this.httpClient.delete<void>(`/api/v1/columnas/${idColumna}`);
    }

}
