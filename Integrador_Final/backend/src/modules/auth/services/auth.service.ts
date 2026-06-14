import { Injectable, UnauthorizedException } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";
import { LoginDto } from "../dtos/input/login.dto";
import { UsuariosService } from "./usuarios.service";

@Injectable()
export class AuthService {
    constructor(private readonly usuariosService: UsuariosService,
        private jwtService: JwtService) { }

    async login(dto: LoginDto): Promise<{ accessToken: string }> {

        const usuario = await this.usuariosService.buscarUsuarioActivoPorNombre(dto.nombre);

        if (!usuario) {
            throw new UnauthorizedException("Usuario no encontrado");
        }

        // comparo la clave que mando el usuario con la que tengo hasheada en la db
        if (!bcrypt.compareSync(dto.clave, usuario.clave)) {
            throw new UnauthorizedException();
        }

        const payload = { nombre: usuario.nombre, sub: usuario.id };

        return {
            accessToken: this.jwtService.sign(payload)
        };
    }
}