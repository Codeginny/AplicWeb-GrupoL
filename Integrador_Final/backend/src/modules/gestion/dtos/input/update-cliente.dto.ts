import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString, IsNotEmpty } from "class-validator";
import { EstadosClientesEnum } from "../../enums/estados-clientes.enum";
import { CreateClienteDto } from "./create-cliente.dto";

export class UpdateClienteDto extends PartialType(CreateClienteDto) {


    @ApiProperty({ enum: EstadosClientesEnum, example: EstadosClientesEnum.ACTIVO, required: false })
    @IsEnum(EstadosClientesEnum)
    @IsOptional()
    estado?: EstadosClientesEnum;

}