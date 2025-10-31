import { Module } from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { ApiModule } from 'src/api/api.module';

@Module({
  imports: [TypeOrmModule.forFeature([Movie]), ApiModule],
  controllers: [MovieController],
  providers: [MovieService],
})
export class MovieModule {}
