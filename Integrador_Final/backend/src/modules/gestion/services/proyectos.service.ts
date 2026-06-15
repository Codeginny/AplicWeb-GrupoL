import { InjectRepository } from "@nestjs/typeorm";
import { CreateProyectoDto } from "../dtos/input/create-proyecto.dto";
import { Proyecto } from "../entities/proyecto.entity";
import { Repository, In } from "typeorm";
import { EstadosProyectosEnum } from "../enums/estados-proyectos.enum";
import { EstadosTareasEnum } from "../enums/estados-tareas.enum";
import { UpdateProyectoDto } from "../dtos/input/update-proyecto.dto";
import { BadRequestException, forwardRef, Inject, Injectable } from "@nestjs/common";
import { ListProyectoDTO } from "../dtos/output/list-proyecto.dto";
import { ProyectoDTO } from "../dtos/output/proyecto.dto";
import { ListTareaDTO } from "../dtos/output/list-tarea.dto";
import { ClientesService } from "./clientes.service";
import { ListClienteDTO } from "../dtos/output/list-cliente.dto";
import { Columna } from "../entities/columna.entity";
import { ListColumnaDTO } from "../dtos/output/list-columna.dto";

@Injectable()
export class ProyectosService {

    constructor(@InjectRepository(Proyecto) private readonly repository: Repository<Proyecto>,
        @Inject(forwardRef(() => ClientesService)) private readonly clientesService: ClientesService) { }

    async crearProyecto(dto: CreateProyectoDto): Promise<{ id: number }> {

        const proyecto: Proyecto = this.repository.create(dto);
        proyecto.estado = EstadosProyectosEnum.ACTIVO;

        if (dto.idCliente) {

            const clienteActivo: boolean = await this.clientesService.existeClienteActivoPorId(dto.idCliente);

            if (!clienteActivo) {
                throw new BadRequestException('Se debe especificar un cliente activo para el proyecto');
            }
        }

        // guardamos el proyecto
        const proyectoGuardado = await this.repository.save(proyecto);

        // retornamos el id generado
        return { id: proyectoGuardado.id };
    }

    async actualizarProyecto(id: number, dto: UpdateProyectoDto): Promise<void> {

        const proyecto: Proyecto | null = await this.repository.findOne({ where: { id }});

        if (!proyecto) {
            throw new BadRequestException('Proyecto no encontrado');
        }

        // chequeo que el cliente exista y este activo
        if (dto.idCliente !== undefined && dto.idCliente !== null) {

            const clienteActivo: boolean = await this.clientesService.existeClienteActivoPorId(dto.idCliente);

            if (!clienteActivo) {
                throw new BadRequestException('Se debe especificar un cliente activo para el proyecto');
            }

        }

        this.repository.merge(proyecto, dto);

        await this.repository.save(proyecto);
    }

    async obtenerProyectos(): Promise<ListProyectoDTO[]> {

        const proyectos: Proyecto[] = await this.repository.find({ relations: ['cliente'], order: { id: 'ASC' } });

        const dtoList: ListProyectoDTO[] = [];

        for (const p of proyectos) {
            const dto = new ListProyectoDTO();
            dto.id = p.id;
            dto.nombre = p.nombre;
            dto.estado = p.estado;
            dto.fechaFinalizacionObjetivo = p.fechaFinalizacionObjetivo;
            if (p.cliente) {
                dto.cliente = new ListClienteDTO();
                dto.cliente.id = p.cliente.id
                dto.cliente.nombre = p.cliente.nombre;
                dto.cliente.estado = p.cliente.estado
            }
            dtoList.push(dto);
        }

        return dtoList;

    }

    async obtenerProyecto(id: number): Promise<ProyectoDTO> {

        let proyecto: Proyecto | null = await this.repository.findOne({ 
            where: { id }, 
            relations: ['cliente', 'tareas', 'columnas', 'columnas.tareas'],
            order: { 
                tareas: { id: 'ASC' }
            } 
        });

        if (!proyecto) {
            throw new BadRequestException('Proyecto no encontrado');
        }

        // inicializamos seguras las listas si vienen nulas
        if (!proyecto.columnas) {
            proyecto.columnas = [];
        } else {
            proyecto.columnas.sort((a, b) => a.orden - b.orden);
        }

        if (!proyecto.tareas) {
            proyecto.tareas = [];
        }

        const dto = new ProyectoDTO();
        dto.nombre = proyecto.nombre;
        dto.estado = proyecto.estado;
        dto.fechaFinalizacionObjetivo = proyecto.fechaFinalizacionObjetivo;
        
        if (proyecto.cliente) {
            dto.cliente = proyecto.cliente.nombre;
        }

        // armo la lista de tareas para el dto
        const tareas: ListTareaDTO[] = [];
        for (const t of proyecto.tareas) {
            const tareaDto = new ListTareaDTO();
            tareaDto.id = t.id;
            tareaDto.descripcion = t.descripcion;
            tareaDto.estado = t.estado;
            tareaDto.idColumna = t.idColumna;
            tareaDto.prioridad = t.prioridad;
            tareaDto.responsable = t.responsable;
            tareaDto.fechaEntrega = t.fechaEntrega;
            tareaDto.idMetaIntermedia = t.idMetaIntermedia; 
            tareas.push(tareaDto);
        }
        dto.tareas = tareas;

        // armo las columnas del dto
        const columnasDto: ListColumnaDTO[] = [];
        for (const col of proyecto.columnas) {
            const colDto = new ListColumnaDTO();
            colDto.id = col.id;
            colDto.nombre = col.nombre;
            colDto.orden = col.orden;
            
            const colTareas: ListTareaDTO[] = [];
            if (col.tareas) {
                col.tareas.sort((a, b) => a.id - b.id);
                for (const t of col.tareas) {
                    const tareaDto = new ListTareaDTO();
                    tareaDto.id = t.id;
                    tareaDto.descripcion = t.descripcion;
                    tareaDto.estado = t.estado;
                    tareaDto.idColumna = t.idColumna;
                    tareaDto.prioridad = t.prioridad;
                    tareaDto.responsable = t.responsable;
                    tareaDto.fechaEntrega = t.fechaEntrega;
                    tareaDto.idMetaIntermedia = t.idMetaIntermedia;
                    colTareas.push(tareaDto);
                }
            }
            colDto.tareas = colTareas;
            columnasDto.push(colDto);
        }
        dto.columnas = columnasDto;

        return dto;

    }

    async existeProyectoPorIdCliente(idCliente: number): Promise<boolean> {

        const existe: boolean = await this.repository.exists({ where: { cliente: { id: idCliente }, estado: In([EstadosProyectosEnum.ACTIVO, EstadosProyectosEnum.FINALIZADO]) } });
        return existe;
    }

}