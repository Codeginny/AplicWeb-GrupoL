import { Module } from "@nestjs/common";        
import { ClientesController } from "./controllers/clientes.controller";
import { ProyectosController } from "./controllers/proyectos.controller";
import { TareasController } from "./controllers/tareas.controller";
import { ColumnasController } from "./controllers/columnas.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Tarea } from "./entities/tarea.entity";
import { Cliente } from "./entities/cliente.entity";
import { Proyecto } from "./entities/proyecto.entity";
import { Columna } from "./entities/columna.entity";
import { TareasService } from "./services/tarea.service";
import { ClientesService } from "./services/clientes.service";
import { ProyectosService } from "./services/proyectos.service";
import { ColumnasService } from "./services/columnas.service";
import { AuthModule } from "../auth/auth.module";
import { MetasIntermediasController } from "./controllers/metas-intermedias.controller";
import { MetasIntermediasService } from "./services/metas-intermedias.service";
import { MetaIntermedia } from "./entities/meta-intermedia.entity";

@Module({

    controllers: [ClientesController,ProyectosController,TareasController, MetasIntermediasController, ColumnasController],
    providers: [TareasService,ClientesService,ProyectosService, MetasIntermediasService, ColumnasService],
    exports: [],
    imports: [
        TypeOrmModule.forFeature([Tarea, Cliente,Proyecto, MetaIntermedia, Columna]),
        AuthModule
    ]
})
export class GestionModule{ 
}

