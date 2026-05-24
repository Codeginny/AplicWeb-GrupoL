import { Component, inject } from "@angular/core";
import { ButtonModule } from "primeng/button";
import { AuthStore } from "../auth/auth-store";

@Component({
    selector: 'app-template',
    templateUrl: './template.html',
    styleUrl: './template.css',
    imports: [ButtonModule]//libreria de botones de prime ng
})
export class Template{//inyectamos un service qeu s la tienda de autenticacion
    //esto lo vamos a usar para el cerrar sesion, para eso necesitamos eliminar el token de autenticacion del session storage y redirigir al login
    private readonly authStore: AuthStore = inject(AuthStore); // inyectamos el servicio de autenticacion para poder usarlo en el template

    cerrarSesion(): void {
        this.authStore.cerrarSesion(); // llamamos al metodo cerrar sesion del servicio de autenticacion para eliminar el token y redirigir al login
    }



}

