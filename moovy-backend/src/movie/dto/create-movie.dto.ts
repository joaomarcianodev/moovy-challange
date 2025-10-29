import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMovieDto {
  @IsString()
  @IsNotEmpty({ message: 'Título é obrigatório' })
  title: string;

  @IsNotEmpty({ message: 'Ano é obrigatório' })
  year: number;

  @IsString()
  @IsNotEmpty({ message: 'IMDB ID é obrigatório' })
  imdbId: string;

  @IsString()
  @IsNotEmpty({ message: 'Tipo é obrigatório' })
  type: string;

  @IsString()
  @IsNotEmpty({ message: 'Poster é obrigatório' })
  poster: string;
}
