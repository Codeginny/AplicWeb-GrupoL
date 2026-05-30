import { BadRequestException, Body, Controller, NotImplementedException, Post } from "@nestjs/common";
import { LoginDto } from "../dtos/input/login.dto";
import { AuthService } from "../services/auth.service";

@Controller("auth")//decorador que indica que esta clase es un controlador de NestJS y que manejará las rutas que comiencen con "auth"
export class AuthController{//inyectamos el servicio de autenticación en el controlador para poder usarlo en los métodos del controlador
    // El constructor de la clase recibe una instancia del servicio de autenticación, 
    // que se inyecta automáticamente por NestJS gracias a la inyección de dependencias
    constructor(private readonly authService: AuthService){}

    // Método que maneja la ruta POST /auth, 
    // recibe un objeto con el nombre y la clave del usuario,
    //  y devuelve un objeto con el token de acceso
    @Post("")//decorador que indica que este método manejará las solicitudes POST a la ruta "/auth"
    async login(@Body() dto: LoginDto): Promise<{accessToken: string}>{//decorador que indica que el parámetro "dto" se obtiene del cuerpo de la solicitud, y que debe ser un objeto del tipo LoginDto
        return await this.authService.login(dto);//llama al método "login" del servicio de autenticación,
        //  pasando el DTO recibido como argumento, y devuelve el resultado, que es un objeto con el token de acceso
    }


}