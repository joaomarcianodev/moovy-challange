import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Review } from 'src/review/entities/review.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  // Um User para Muitos Reviews
  @OneToMany(() => Review, (review) => review.user, { eager: true })
  reviews: Review[]; // Propriedade para acessar as reviews do usuário
}
