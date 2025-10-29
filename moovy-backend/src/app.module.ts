import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { ApiModule } from './api/api.module';
import { UserModule } from './user/user.module';
import { MovieModule } from './movie/movie.module';
import { ReviewModule } from './review/review.module';

@Module({
  imports: [
    //configurações globais do .env
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    //conexão com o banco
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
    }),

    HttpModule,

    ApiModule,

    UserModule,

    MovieModule,

    ReviewModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
