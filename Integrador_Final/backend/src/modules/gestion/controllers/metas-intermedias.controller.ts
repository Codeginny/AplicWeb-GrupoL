import { Controller, Post, Put, Delete, Get, Param, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from "../../auth/guards/auth.guard";
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MetasIntermediasService } from "../services/metas-intermedias.service";
import { CreateMetaIntermediaDto } from "../dtos/input/create-meta-intermedia.dto";
import { UpdateMetaIntermediaDto } from "../dtos/input/update-meta-intermedia.dto";

@ApiTags('metas-intermedias')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('proyectos/:idProyecto/metas')
export class MetasIntermediasController {
    constructor(private readonly metasService: MetasIntermediasService) {}

    @Post()
    async crearMeta(@Param('idProyecto') idProyecto: number, @Body() dto: CreateMetaIntermediaDto) {
        return this.metasService.crearMeta(idProyecto, dto);
    }

    @Put(':idMeta')
    async actualizarMeta(@Param('idMeta') idMeta: number, @Body() dto: UpdateMetaIntermediaDto) {
        return this.metasService.actualizarMeta(idMeta, dto);
    }

    @Delete(':idMeta')
    async eliminarMeta(@Param('idMeta') idMeta: number) {
        return this.metasService.eliminarMeta(idMeta);
    }

    @Get()
    async obtenerMetas(@Param('idProyecto') idProyecto: number) {
        return this.metasService.obtenerMetasPorProyecto(idProyecto);
    }
}