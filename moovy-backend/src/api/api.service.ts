import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

// Interface para a resposta da busca por TÍTULO (parâmetro s=)
interface OmdbSearchResponse {
  Search: {
    Title: string;
    Year: string;
    imdbID: string;
    Type: string;
    Poster: string;
  }[];
  Response: 'True' | 'False';
  Error?: string;
  totalResults?: string;
}

// Interface para a resposta da busca por ID (parâmetro i=)
interface OmdbMovieResponse {
  Title: string;
  Year: string;
  imdbID: string;
  imdbRating: string;
  Ratings: { Source: string; Value: string }[];
  Response: 'True' | 'False';
  Error?: string;
}

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

  // Buscar todos os filmes que correspondem ao título
  public async buscarDadosDaApi(title: string): Promise<OmdbSearchResponse> {
    const url = `https://www.omdbapi.com/?type=movie&s=${title}&apikey=${this.apiKey}`;

    try {
      const observable = this.httpService.get<OmdbSearchResponse>(url);
      const response = await firstValueFrom(observable);

      return response.data;
    } catch (error) {
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

  // Buscar dados de UM filme pelo imdbID
  public async buscarDadosImdb(imdbId: string): Promise<string> {
    const url = `https://www.omdbapi.com/?i=${imdbId}&apikey=${this.apiKey}`;

    try {
      const observable = this.httpService.get<OmdbMovieResponse>(url);
      const response = await firstValueFrom(observable);

      if (response.data.Response === 'False') {
        throw new Error(response.data.Error || 'Filme não encontrado');
      }

      return response.data.imdbRating;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        console.error(
          'Erro de API:',
          error.response.status,
          error.response.data,
        );
      } else if (error instanceof Error) {
        // Se o erro foi o 'Filme não encontrado' que jogamos acima, ele será pego aqui.
        console.error('Erro de rede ou Axios:', error.message);
      } else {
        console.error('Erro desconhecido:', error);
      }
      throw new Error('Falha ao buscar dados da API externa.');
    }
  }
}
