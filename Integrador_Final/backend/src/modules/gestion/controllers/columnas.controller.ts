import { Body, Controller, Delete, Param, Patch, UseGuards } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { UpdateColumnaDto } from "../dtos/input/update-columna.dto";
import { ColumnasService } from "../services/columnas.service";
import { AuthGuard } from "../../auth/guards/auth.guard";

@Controller('columnas')
export class ColumnasController {

    constructor(private readonly columnasService: ColumnasService) {}


    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Patch(':id')
    async actualizarColumna(@Param('id') id: number, @Body() dto: UpdateColumnaDto): Promise<void> {
        await this.columnasService.actualizarColumna(id, dto);
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Delete(':id')
    async eliminarColumna(@Param('id') id: number): Promise<void> {
        await this.columnasService.eliminarColumna(id);
    }
}
