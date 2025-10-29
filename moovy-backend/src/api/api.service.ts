import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

@Injectable()
export class ApiService {
  private readonly apiKey;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>('OMDB_API_KEY');
    if (!this.apiKey) {
      throw new Error('Variável de ambiente OMDB_API_KEY não definida.');
    }
  }

  public async buscarDadosDaApi(title: string): Promise<any> {
    const url = `https://www.omdbapi.com/?s=${title}&apikey=${this.apiKey}`;

    try {
      const observable = this.httpService.get<any>(url);
      const response = await firstValueFrom(observable);

      return response.data;
    } catch (error) {
      // O servidor respondeu com um status de erro (4xx, 5xx)
      if (error instanceof AxiosError && error.response) {
        console.error(
          'Erro de API:',
          error.response.status,
          error.response.data,
        );
      } else if (error instanceof Error) {
        console.error('Erro de rede ou Axios:', error.message);
      } else {
        console.error('Erro desconhecido:', error);
      }

      throw new Error('Falha ao buscar dados da API externa.');
    }
  }
}
