import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class LoginDto { //ES UNA CLASE QUE VA A DEINIFIR EL CONTRATO DE NUESTROS ENDPOINTS, VAMOS A DECIR "ESTE ENDPOINT DEBE RETORNAR O RECIBIR UN JSON QUE SE ADPTE A ESTA ESTRUCTURA"

    @ApiProperty()//ESTA DECORACION ES PARA DOCUMENTAR EL DTO EN SWAGGER, LE DICE A SWAGGER QUE ESTE CAMPO ES UNA PROPIEDAD QUE DEBE APARECER EN LA DOCUMENTACION DE LA API, Y LE PUEDE PASAR OPCIONES COMO DESCRIPCION, EJEMPLO, ETC.
    @IsString({message: "El nombre debe ser una cadena de texto"})//VALIDA QUE EL CAMPO SEA DE TIPO STRING
    @IsNotEmpty({message: "El nombre no puede estar vacío"})//VALIDA QUE EL CAMPO NO ESTE VACIO, hace que sea obligatorio
    nombre!:string//EL SIGNO DE EXCLAMACION ES PARA DECIRLE A TYPESCRIPT QUE ESTAMOS SEGUROS QUE ESTE CAMPO VA A SER INICIALIZADO, ASI EVITAMOS EL ERROR DE "EL PROPERTY 'NOMBRE' NO ESTA INICIALIZADO EN EL CONSTRUCTOR"
    
    @ApiProperty()
    @IsString({message: "La clave debe ser una cadena de texto"})//VALIDA QUE EL CAMPO SEA DE TIPO STRING
    @IsNotEmpty({message: "La clave no puede estar vacía"})//VALIDA QUE EL CAMPO NO ESTE VACIO
    clave!:string

}



