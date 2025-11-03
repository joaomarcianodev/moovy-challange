import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './entities/movie.entity';

const audioStorage = diskStorage({
  destination: './uploads/audio',
  // Nome do arquivo: movie-(id no banco)-(randomName).webm
  filename: (req, file, cb) => {
    const id = req.params.id;
    const randomName = Array(16)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');
    cb(null, `movie-${id}-${randomName}${extname(file.originalname)}`);
  },
});

@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Post(':id/audio')
  @UseInterceptors(FileInterceptor('file', { storage: audioStorage }))
  uploadAudio(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new Error('Audio file is required');
    }

    const audioPath = `/media/audio/${file.filename}`;
    console.log('Caminho do áudio salvo:', audioPath);

    return this.movieService.addAudio(id, audioPath);
  }

  @Post()
  create(@Body() createMovieDto: CreateMovieDto): Promise<Movie> {
    return this.movieService.create(createMovieDto);
  }

  @Get()
  findAll() {
    return this.movieService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.movieService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMovieDto: UpdateMovieDto) {
    return this.movieService.update(+id, updateMovieDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.movieService.remove(+id);
  }
}
