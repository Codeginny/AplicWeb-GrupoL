import { Module } from "@nestjs/common";        
import { ClientesController } from "./controllers/clientes.controller";
import { ProyectosController } from "./controllers/proyectos.controller";
import { TareasController } from "./controllers/tareas.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Tarea } from "./entities/tarea.entity";
import { Cliente } from "./entities/cliente.entity";
import { Proyecto } from "./entities/proyecto.entity";
import { TareasService } from "./services/tarea.service";
import { ClientesService } from "./services/clientes.service";
import { ProyectosService } from "./services/proyectos.service";
import { AuthModule } from "../auth/auth.module";
import { MetasIntermediasController } from "./controllers/metas-intermedias.controller";
import { MetasIntermediasService } from "./services/metas-intermedias.service";
import { MetaIntermedia } from "./entities/meta-intermedia.entity";

@Module({
    controllers: [ClientesController,ProyectosController,TareasController, MetasIntermediasController],
    providers: [TareasService,ClientesService,ProyectosService, MetasIntermediasService],
    exports: [],
    imports: [// Agrego aquí tus entidades, por ejemplo: Cliente, Proyecto, Tarea ||-> AGREGO para GUARD TMB "AuthModule" -<
        TypeOrmModule.forFeature([Tarea, Cliente,Proyecto, MetaIntermedia]),
        AuthModule
    ]
})
export class GestionModule{ 
}

