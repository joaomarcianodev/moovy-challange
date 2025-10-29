import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Movie } from '../movie/entities/movie.entity';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
  ) {}

  async create(createReviewDto: CreateReviewDto): Promise<Review> {
    /*const userExists = await this.userRepository.findOne({
      where: { id: createReviewDto.userId },
    });
    if (!userExists) {
      throw new NotFoundException(
        `User with ID ${createReviewDto.userId} not found`,
      );
    }*/

    const movieExists = await this.movieRepository.findOne({
      where: { id: createReviewDto.movieId },
    });
    if (!movieExists) {
      throw new NotFoundException(
        `Movie with ID ${createReviewDto.movieId} not found`,
      );
    }

    const newReview = this.reviewRepository.create({
      rating: createReviewDto.rating,
      path: createReviewDto.path,
      user: { id: createReviewDto.userId ?? 1 },
      movie: { id: createReviewDto.movieId },
    });

    console.log('Entity before save:', newReview);

    return this.reviewRepository.save(newReview);
  }

  findAll() {
    return this.reviewRepository.find();
  }

  findOne(id: number) {
    return this.reviewRepository.findOne({ where: { id } });
  }

  update(id: number, updateReviewDto: UpdateReviewDto) {
    return this.reviewRepository.update({ id }, updateReviewDto);
  }

  remove(id: number) {
    return this.reviewRepository.delete({ id });
  }
}
