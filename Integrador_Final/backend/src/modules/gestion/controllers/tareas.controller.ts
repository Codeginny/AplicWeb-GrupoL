import { Body, Controller, NotImplementedException, Param, Post, Put, UseGuards } from "@nestjs/common";
import { UpdateTareaDto } from "../dtos/input/update-tarea.dto";
import { CreateTareaDto } from "../dtos/input/create-tarea.dto";
import { ApiBearerAuth } from "@nestjs/swagger";
import { TareasService } from "../services/tarea.service";
import { AuthGuard } from "../../auth/guards/auth.guard";

@Controller('proyectos/:idProyecto/tareas')
export class TareasController {

    constructor(private readonly tareasService: TareasService) { }

    @ApiBearerAuth()//ESTO ES PARA DECIRLE A SWAGGER QUE MI AUTENTICACION VA  ESTAR PROTEGIDA CON BEARER TOKEN, ASI QUE ME VA A MOSTRAR EL BOTON DE "AUTHORIZE" PARA QUE PUEDA INGRESAR MI TOKEN DE AUT  
    @UseGuards(AuthGuard)//28:12 Video 3 - Unidad 2 - Practica - AGREGO GUARDIAS PARA PROTEGER LA RUTA DE CREACION DE TAREAS, SOLO USUARIOS AUTENTICADOS PODRAN ACCEDER A ELLA
    @Post()
    async crearTarea(@Body() dto: CreateTareaDto, @Param('idProyecto') idProyecto: number): Promise<{ id: number }> {

        return await this.tareasService.crearTarea(dto, idProyecto);

    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Put(':id')
    async actualizarTarea(@Body() dto: UpdateTareaDto, @Param('id') id: number): Promise<void> {
       
       await this.tareasService.actualizarTarea(dto, id);

    }

}