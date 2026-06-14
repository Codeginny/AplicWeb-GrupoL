import { Injectable, UnauthorizedException } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";
import { LoginDto } from "../dtos/input/login.dto";
import { UsuariosService } from "./usuarios.service";

@Injectable()//decorador que indica que esta clase es un servicio de NestJS,
//  lo que permite que se inyecte en otros componentes como controladores o otros servicios


//Servicio de autenticacion 12:22 Video 3 - Unidad 2  - Practica
export class AuthService {// El servicio de autenticación es el encargado de manejar la lógica de autenticación de los usuarios,
    //  como verificar las credenciales, generar el token de acceso, etc.
    constructor(private readonly usuariosService: UsuariosService,
        private jwtService: JwtService) { }
        // El servicio de autenticación tiene dos dependencias: el servicio de usuarios,
        //  para buscar el usuario en la base de datos, y el servicio de JWT, para generar el token de acceso

    async login(dto: LoginDto): Promise<{ accessToken: string }> {

        const usuario = await this.usuariosService.buscarUsuarioActivoPorNombre(dto.nombre);

        if (!usuario) {
            throw new UnauthorizedException("Usuario no encontrado");
        }

        if (!bcrypt.compareSync(dto.clave, usuario.clave)) {
            throw new UnauthorizedException();
        }

        const payload = { nombre: usuario.nombre, sub: usuario.id };

        return {
            accessToken: this.jwtService.sign(payload)
        };
    }
}