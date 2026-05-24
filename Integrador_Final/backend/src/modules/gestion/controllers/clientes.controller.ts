import { Body, Controller, Get, NotImplementedException, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { CreateClienteDto } from "../dtos/input/create-cliente.dto";
import { ApiBearerAuth, ApiOkResponse, ApiQuery } from "@nestjs/swagger";
import { ListClienteDTO } from "../dtos/output/list-cliente.dto";
import { UpdateClienteDto } from "../dtos/input/update-cliente.dto";
import { EstadosClientesEnum } from "../enums/estados-clientes.enum";
import { ClientesService } from "../services/clientes.service";
import { AuthGuard } from "../../auth/guards/auth.guard";

@Controller('clientes')
export class ClientesController {

    constructor(private readonly clientesService: ClientesService) { }//inyectamos el servicio de clientes para poder usarlo en los metodos del controlador

    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Post()
    async crearCliente(@Body() dto: CreateClienteDto): Promise<{ id: number }> {
        return await this.clientesService.crearCliente(dto);
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Put(":id")
    async actualizarCliente(@Param("id") id: number, @Body() dto: UpdateClienteDto): Promise<void> {
        await this.clientesService.actualizarCliente(id, dto);
    }

    @ApiBearerAuth()
    @ApiOkResponse({ type: ListClienteDTO, isArray: true })// El endpoint devuelve un array de objetos ListClienteDTO para swagger para que la documentacion sea clara y muestre el formato de la respuesta
    @ApiQuery({// para swagger, indica que el endpoint acepta un query param "estado" que es opcional y de tipo enum EstadosClientesEnum
        name: 'estado',
        required: false,
        enum: EstadosClientesEnum
    })
    @UseGuards(AuthGuard)     
    @Get()// 
    async obtenerClientes(@Query("estado") estado: EstadosClientesEnum): Promise<ListClienteDTO[]> {
        return await this.clientesService.obtenerClientes(estado);
    }

}