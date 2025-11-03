import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { Repository } from 'typeorm';
import { ApiService } from '../api/api.service';
import { promises as fs } from 'fs';
import { join } from 'path';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    private readonly apiService: ApiService,
  ) {}

  private async deleteAudioFile(audioPath: string) {
    if (!audioPath) return;

    try {
      // Arquivo vem como \/audio/arquivo.webm
      const relativePath = audioPath.replace('/media', '');

      // process.cwd() é a raiz do projeto (moovy-backend/)
      // O caminho fica: 'moovy-backend/uploads/audio/arquivo.webm'
      const fullFilePath = join(process.cwd(), 'uploads', relativePath);

      // Deleta o arquivo
      await fs.unlink(fullFilePath);
      console.log(`Arquivo de áudio deletado: ${fullFilePath}`);
    } catch (error) {
      console.error(`Falha ao deletar arquivo de áudio: ${audioPath}`, error);
    }
  }

  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    const newMovie: Movie = this.movieRepository.create(createMovieDto);

    const existMovies = await this.movieRepository.find();
    if (existMovies.some((movie) => movie.imdbId === newMovie.imdbId)) {
      throw new ConflictException('Movie already registered in the system');
    }

    let imdbRating: string;
    try {
      imdbRating = await this.apiService.buscarDadosImdb(newMovie.imdbId);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Mensagem do Erro:', error.message);
      }
      imdbRating = '0.0';
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

  async remove(id: number) {
    const movie = await this.findOne(id);
    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    const deleteResult = await this.movieRepository.delete({ id });
    if (movie.audioPath) {
      await this.deleteAudioFile(movie.audioPath);
    }

    return deleteResult;
  }

  async addAudio(id: number, audioPath: string): Promise<Movie> {
    const movie = await this.findOne(id);
    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    if (movie.audioPath) {
      await this.deleteAudioFile(movie.audioPath);
    }

    movie.audioPath = audioPath;
    return this.movieRepository.save(movie);
  }
}
