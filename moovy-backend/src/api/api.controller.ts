import { Controller, Get, BadRequestException, Param } from '@nestjs/common';
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
}
