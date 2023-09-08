import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from "./pipes/validation.pipe";
import { MulterMiddleware } from './multer.middleware';

async function bootstrap() {
    const PORT = process.env.PORT || 5000;
    const app = await NestFactory.create(AppModule, { cors: false });

    const config = new DocumentBuilder()
        .setTitle("Test")
        .setDescription("REST Api Documentation")
        .addBearerAuth()
        .setVersion('1.0.0')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/api/docs', app, document);

    app.useGlobalPipes(new ValidationPipe())

    app.use('/upload', MulterMiddleware)

    await app.listen(PORT, () => console.log(`Server started on port = ${PORT}`))
}
bootstrap();
