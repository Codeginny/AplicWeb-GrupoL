import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsEnum, IsOptional } from "class-validator";
import { CreateClienteDto } from "./create-cliente.dto";
import { EstadosClientesEnum } from "../../enums/estados-clientes.enum";

export class UpdateClienteDto extends PartialType(CreateClienteDto) {
    // PartialType hace que todas las propiedades de CreateClienteDto sean opcionales
    //quiere decir: "declara una clase updatecliendta que tiene las mismas propiedades que createcliente pero todas como opcionales + las propiedades
    // que tiene como tal, "estado!" de tipo EstadosClientesEnum, que es un enum que tiene los valores ACTIVO y BAJA"

    @ApiProperty({ enum: EstadosClientesEnum, example: EstadosClientesEnum.ACTIVO })// El estado del cliente, que puede ser ACTIVO o BAJA. Es opcional, ya que al actualizar un cliente no es necesario cambiar su estado.
    
    @IsEnum(EstadosClientesEnum)
    @IsOptional()//
    estado!: EstadosClientesEnum;

}