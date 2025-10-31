import {
  Controller,
  Get,
  BadRequestException,
  Param,
  Query,
} from '@nestjs/common';
import { ApiService } from './api.service';

@Controller('api')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @Get('/:title')
  public async searchMovie(@Param('title') title: string): Promise<any> {
    if (!title || title.trim() === '') {
      throw new BadRequestException('O parâmetro "title" não pode ser vazio.');
    }

    return this.apiService.buscarDadosDaApi(title);
  }

  @Get()
  public async searchRatingImdbMovie(
    @Query('imdbId') imdbId: string,
  ): Promise<number> {
    if (!imdbId) {
      throw new BadRequestException('O parâmetro "imdbId" não pode ser vazio.');
    }

    const imdbRating = await this.apiService.buscarDadosImdb(imdbId);
    return imdbRating;
  }
}
