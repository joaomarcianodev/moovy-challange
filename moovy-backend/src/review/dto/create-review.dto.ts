import { IsInt, IsNotEmpty, IsOptional, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @IsInt({ message: 'A avaliação precisar ser um número inteiro' })
  @Min(1, { message: 'A avaliação precisa ser maior ou igual a 1' })
  @Max(5, { message: 'A avaliação precisa ser menor ou igual a 5' })
  @IsOptional()
  rating?: number;

  @IsOptional()
  path?: string;

  // --- IDs para Associação ---
  //@IsInt()
  //@IsNotEmpty({ message: 'O ID do usuário é obrigatório' })
  @IsOptional()
  userId?: number;

  @IsInt()
  @IsNotEmpty({ message: 'O ID do filme é obrigatório' })
  movieId: number;
}
