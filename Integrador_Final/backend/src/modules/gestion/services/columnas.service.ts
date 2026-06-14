import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Columna } from "../entities/columna.entity";
import { Proyecto } from "../entities/proyecto.entity";
import { UpdateColumnaDto } from "../dtos/input/update-columna.dto";

@Injectable()
export class ColumnasService {

    constructor(
        @InjectRepository(Columna) private readonly columnasRepository: Repository<Columna>,
        @InjectRepository(Proyecto) private readonly proyectosRepository: Repository<Proyecto>
    ) {}


    async actualizarColumna(id: number, dto: UpdateColumnaDto): Promise<void> {
        const columna = await this.columnasRepository.findOne({ where: { id } });
        if (!columna) {
            throw new BadRequestException("La columna indicada no existe");
        }

        if (dto.nombre !== undefined) {
            columna.nombre = dto.nombre;
        }
        if (dto.orden !== undefined) {
            columna.orden = dto.orden;
        }

        await this.columnasRepository.save(columna);
    }

    async eliminarColumna(id: number): Promise<void> {
        const columna = await this.columnasRepository.findOne({ where: { id } });
        if (!columna) {
            throw new BadRequestException("La columna indicada no existe");
        }
        await this.columnasRepository.delete(id);
    }
}
