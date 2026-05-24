import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';//Importa el módulo de seguridad Helmet para proteger la aplicación de vulnerabilidades comunes.
import { VersioningType } from '@nestjs/common/enums/version-type.enum';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import { DocumentBuilder } from '@nestjs/swagger/dist/document-builder';
import { SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());//Permite configurar varias cabezeras de seguridad por defecto, HTTP para mejorar la seguridad de la aplicación.


  const globalPrefix = 'api';//Define un prefijo global para todas las rutas de la aplicación, en este caso 'api'.Sirve para configurar de forma sensilla proxis inversos
  app.setGlobalPrefix(globalPrefix); //Configura un prefijo global para todas las rutas de la aplicación, lo que permite organizar mejor las rutas y facilitar la gestión de versiones de la API.

  //Sire para versionar Endpoints de la API, permitiendo gestionar diferentes versiones de la API de manera sencilla.
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });//Habilita el versionado de la API utilizando la URI, lo que permite gestionar diferentes versiones de la API de manera sencilla.

  //VALIDATIONPIPE , CUANDO HACEMOS UNA LLAMADA A UN ENDPONT Y LE PASAMOS UN JSON, HACEMOS QUE SE VALIDE Y ARROJE ERRORES SI NO RESPETA LA ESTRUCTURA QUE DEFINIMOS QUE DEBE TENER
  app.useGlobalPipes(new ValidationPipe( {whitelist:true, forbidNonWhitelisted:true} ));//Habilita el uso de tuberías de validación globales, lo que permite validar los datos de entrada en toda la aplicación de manera consistente.

  if(process.env.SWAGGER_HABILITADO === 'true'){
    const config = new DocumentBuilder()
    .setTitle('Sistema de Gestion de Proyectos')
    .setDescription('API REST para la gestión de proyectos, tareas y usuarios.')
    .addBearerAuth()//es importante para uqe funicone correcto con nuestro jwt
    .build()
    ;
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(globalPrefix, app, document);
  }


  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
