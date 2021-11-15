import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Review } from '../reviews/entity';

@Entity(
  {
    orderBy: {
      createdAt: `DESC`,
    },
  },
)
export class Product {

  @PrimaryGeneratedColumn(`uuid`)
  id: string;

  @Column({ length: `256` })
  name: string;

  @OneToMany(() => Review, review => review.product)
  reviews: Review[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
