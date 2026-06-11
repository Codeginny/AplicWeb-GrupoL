import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MetaIntermedia } from "../entities/meta-intermedia.entity";
import { CreateMetaIntermediaDto } from '../dtos/input/create-meta-intermedia.dto';
import { UpdateMetaIntermediaDto } from '../dtos/input/update-meta-intermedia.dto';
import { ListMetaIntermediaDTO } from '../dtos/output/list-meta-intermedia.dto';

@Injectable()
export class MetasIntermediasService {
    constructor(
        @InjectRepository(MetaIntermedia)
        private readonly metaRepository: Repository<MetaIntermedia>,
    ) {}

    async crearMeta(idProyecto: number, dto: CreateMetaIntermediaDto): Promise<{ id: number }> {
        const meta = this.metaRepository.create({ ...dto, idProyecto });
        const saved = await this.metaRepository.save(meta);
        return { id: saved.id };
    }

    async actualizarMeta(idMeta: number, dto: UpdateMetaIntermediaDto): Promise<void> {
        const meta = await this.metaRepository.findOneBy({ id: idMeta });
        if (!meta) throw new NotFoundException('Meta intermedia no encontrada');
        this.metaRepository.merge(meta, dto);
        await this.metaRepository.save(meta);
    }

    async eliminarMeta(idMeta: number): Promise<void> {
        const meta = await this.metaRepository.findOne({
            where: { id: idMeta },
            relations: ['tareas'],
        });
        if (!meta) throw new NotFoundException('Meta intermedia no encontrada');

        if (meta.tareas && meta.tareas.length > 0) {
            throw new BadRequestException('No se puede eliminar la meta porque tiene tareas asociadas.');
        }
        await this.metaRepository.remove(meta);
    }

    async obtenerMetasPorProyecto(idProyecto: number): Promise<ListMetaIntermediaDTO[]> {
        const metas = await this.metaRepository.find({
            where: { idProyecto },
            relations: ['tareas'],
            order: { id: 'ASC' },
        });
        return metas.map(m => ({
            id: m.id,
            nombre: m.nombre,
            descripcion: m.descripcion,
            idProyecto: m.idProyecto,
            tareasCount: m.tareas?.length || 0,
        }));
    }
}