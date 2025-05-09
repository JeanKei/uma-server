import { RequestMethod } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import * as cookieParser from "cookie-parser";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("api", {
    exclude: [{ path: "auth/telegram/redirect", method: RequestMethod.GET }],
  });

  app.use(cookieParser());
  app.enableCors({
    origin: [
      "http://localhost:3000",
      "https://0752-45-133-194-164.ngrok-free.app",
    ],
    credentials: true,
    exposedHeaders: "set-cookie",
  });

  await app.listen(4200);
}
bootstrap();
