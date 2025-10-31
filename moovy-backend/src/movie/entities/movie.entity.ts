import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  year: number;

  @Column()
  imdbId: string;

  @Column()
  type: string;

  @Column()
  poster: string;

  @Column({ nullable: true })
  rating?: number;

  @Column({ nullable: true })
  audioPath?: string;

  /*
  // Um Movie para Muitos Reviews
  @OneToMany(() => Review, (review) => review.movie)
  reviews: Review[]; // Propriedade para acessar as reviews do filme
  */
}
