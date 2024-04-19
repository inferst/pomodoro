import { Module } from "@nestjs/common";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { SocketModule } from "./socket/socket.module";

@Module({
  imports: [
    SocketModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "..", "frontend", "dist"),
      renderPath: "*",
      serveRoot: "/frontend",
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
