import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { VersioningType } from '@nestjs/common/enums/version-type.enum';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import { DocumentBuilder } from '@nestjs/swagger/dist/document-builder';
import { SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // seguridad con helmet
  app.use(helmet());

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  // versionado de la api
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

  // validacion de los datos que llegan por los endpoints
  app.useGlobalPipes(new ValidationPipe( {whitelist:true, forbidNonWhitelisted:true} ));

  if(process.env.SWAGGER_HABILITADO === 'true'){
    const config = new DocumentBuilder()
    .setTitle('Sistema de Gestion de Proyectos')
    .setDescription('API REST para la gestión de proyectos, tareas y usuarios.')
    .addBearerAuth()
    .build()
    ;
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(globalPrefix, app, document);
  }

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
