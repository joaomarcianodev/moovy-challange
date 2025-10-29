import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Movie } from '../../movie/entities/movie.entity';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int', { nullable: true })
  rating?: number;

  @Column({ nullable: true })
  path?: string;

  // Muitos Reviews para Um User
  @ManyToOne(() => User, (user) => user.reviews)
  user: User; // Isso criará automaticamente uma coluna userId no banco

  // Muitos Reviews para Um Movie
  @ManyToOne(() => Movie, (movie) => movie.reviews, { eager: true })
  movie: Movie; // Isso criará automaticamente uma coluna movieId no banco
}
