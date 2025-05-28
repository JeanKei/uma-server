import { RequestMethod } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import * as cookieParser from "cookie-parser";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const rawOrigins = config.getOrThrow<string>("ALLOWED_ORIGIN");
  const origins = rawOrigins.split(",").map((origin) => origin.trim());

  app.setGlobalPrefix("api", {
    exclude: [{ path: "auth/telegram/redirect", method: RequestMethod.GET }],
  });

  app.use(cookieParser());
  app.enableCors({
    origin: origins,
    credentials: true,
    exposedHeaders: "set-cookie",
  });

  await app.listen(4200);
}
bootstrap();
