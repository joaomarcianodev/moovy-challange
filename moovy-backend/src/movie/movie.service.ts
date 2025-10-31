import { Injectable } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { Repository } from 'typeorm';
import { ApiService } from '../api/api.service';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    private readonly apiService: ApiService,
  ) {}

  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    const newMovie: Movie = this.movieRepository.create(createMovieDto);

    const existMovies = await this.movieRepository.find();
    if (existMovies.some((movie) => movie.imdbId === newMovie.imdbId)) {
      throw new Error('Filme já cadastrado no sistema');
    }

    let imdbRating: number;
    try {
      imdbRating = await this.apiService.buscarDadosImdb(newMovie.imdbId);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Mensagem do Erro:', error.message);
      }
      imdbRating = 0.0;
    }
    newMovie.rating = imdbRating;

    const savedMovie = await this.movieRepository.save(newMovie);

    return savedMovie;
  }

  findAll() {
    return this.movieRepository.find();
  }

  findOne(id: number) {
    return this.movieRepository.findOne({ where: { id } });
  }

  update(id: number, updateMovieDto: UpdateMovieDto) {
    return this.movieRepository.update({ id }, updateMovieDto);
  }

  remove(id: number) {
    return this.movieRepository.delete({ id });
  }
}
