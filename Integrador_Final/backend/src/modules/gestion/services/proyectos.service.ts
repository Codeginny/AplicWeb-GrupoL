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

        await this.repository.save(proyecto);
        return { id: proyecto.id };
    }

    async actualizarProyecto(id: number, dto: UpdateProyectoDto): Promise<void> {

        const proyecto: Proyecto | null = await this.repository.findOne({ where: { id }});

        if (!proyecto) {
            throw new BadRequestException('Proyecto no encontrado');
        }

        // Validar cliente solo cuando se envía un id (no null ni undefined)
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

        // Auto-inicializar columnas si no existen o no son exactamente 3
        if (!proyecto.columnas || proyecto.columnas.length === 0) {
            const col1 = new Columna();
            col1.nombre = 'Pendiente';
            col1.orden = 1;
            col1.idProyecto = proyecto.id;
            col1.proyecto = proyecto;
            col1.tareas = [];

            const col2 = new Columna();
            col2.nombre = 'En proceso';
            col2.orden = 2;
            col2.idProyecto = proyecto.id;
            col2.proyecto = proyecto;
            col2.tareas = [];

            const col3 = new Columna();
            col3.nombre = 'Terminado';
            col3.orden = 3;
            col3.idProyecto = proyecto.id;
            col3.proyecto = proyecto;
            col3.tareas = [];

            await this.repository.manager.save(Columna, [col1, col2, col3]);
            
            // Recargar para obtener IDs de columnas
            proyecto = await this.repository.findOne({ 
                where: { id }, 
                relations: ['cliente', 'tareas', 'columnas', 'columnas.tareas'],
                order: { 
                    tareas: { id: 'ASC' }
                } 
            });
            if (!proyecto) throw new BadRequestException('Proyecto no encontrado');
        } else if (proyecto.columnas.length < 3) {
            const names = ['Pendiente', 'En proceso', 'Terminado'];
            const currentCount = proyecto.columnas.length;
            const newCols: Columna[] = [];
            for (let i = currentCount; i < 3; i++) {
                const col = new Columna();
                col.nombre = names[i];
                col.orden = i + 1;
                col.idProyecto = proyecto.id;
                col.proyecto = proyecto;
                col.tareas = [];
                newCols.push(col);
            }
            await this.repository.manager.save(Columna, newCols);
            proyecto = await this.repository.findOne({ 
                where: { id }, 
                relations: ['cliente', 'tareas', 'columnas', 'columnas.tareas'],
                order: { 
                    tareas: { id: 'ASC' }
                } 
            });
            if (!proyecto) throw new BadRequestException('Proyecto no encontrado');
        } else if (proyecto.columnas.length > 3) {
            proyecto.columnas.sort((a, b) => a.orden - b.orden);
            const toKeep = proyecto.columnas.slice(0, 3);
            const toDelete = proyecto.columnas.slice(3);
            await this.repository.manager.remove(Columna, toDelete);
            proyecto = await this.repository.findOne({ 
                where: { id }, 
                relations: ['cliente', 'tareas', 'columnas', 'columnas.tareas'],
                order: { 
                    tareas: { id: 'ASC' }
                } 
            });
            if (!proyecto) throw new BadRequestException('Proyecto no encontrado');
        }

        // Asegurarnos de que las 3 columnas tengan orden 1, 2, 3 y ordenarlas
        proyecto.columnas.sort((a, b) => a.orden - b.orden);
        let orderChanged = false;
        for (let i = 0; i < proyecto.columnas.length; i++) {
            if (proyecto.columnas[i].orden !== i + 1) {
                proyecto.columnas[i].orden = i + 1;
                orderChanged = true;
            }
        }
        if (orderChanged) {
            await this.repository.manager.save(Columna, proyecto.columnas);
            proyecto.columnas.sort((a, b) => a.orden - b.orden);
        }

        // Mapear tareas huérfanas
        let changed = false;
        for (const t of proyecto.tareas) {
            if (!t.idColumna || !t.estado) {
                let matchedCol = proyecto.columnas[0];
                let matchedEstado = EstadosTareasEnum.PENDIENTE;
                if (t.estado === EstadosTareasEnum.EN_PROGRESO) {
                    matchedCol = proyecto.columnas[1];
                    matchedEstado = EstadosTareasEnum.EN_PROGRESO;
                } else if (t.estado === EstadosTareasEnum.FINALIZADA) {
                    matchedCol = proyecto.columnas[2];
                    matchedEstado = EstadosTareasEnum.FINALIZADA;
                }
                
                t.idColumna = matchedCol.id;
                t.columna = matchedCol;
                t.estado = matchedEstado;
                if (!matchedCol.tareas) matchedCol.tareas = [];
                if (!matchedCol.tareas.some(x => x.id === t.id)) {
                    matchedCol.tareas.push(t);
                }
                changed = true;
            }
        }

        if (changed) {
            // Guardar cambios de asociación en la DB
            await this.repository.save(proyecto);
        }

        const dto = new ProyectoDTO();
        dto.nombre = proyecto.nombre;
        dto.estado = proyecto.estado;
        if (proyecto.cliente) {
            dto.cliente = proyecto.cliente.nombre;
        }

        // Mapear tareas global list
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
            tareas.push(tareaDto);
        }
        dto.tareas = tareas;

        // Mapear columnas DTO
        const columnasDto: ListColumnaDTO[] = [];
        for (const col of proyecto.columnas) {
            const colDto = new ListColumnaDTO();
            colDto.id = col.id;
            colDto.nombre = col.nombre;
            colDto.orden = col.orden;
            
            const colTareas: ListTareaDTO[] = [];
            if (col.tareas) {
                // Ordenar tareas por ID
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