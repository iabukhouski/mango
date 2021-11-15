import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Product } from '../../products/dal/entity';

@Entity(
  {
    orderBy: {
      createdAt: `DESC`,
    },
  },
)
export class Review {

  @PrimaryGeneratedColumn(`uuid`)
  id: string;

  @ManyToOne(() => Product)
  product: Product;

  @Column()
  productId: string;

  @Column({ type: `float` })
  score: number;

  @Column({ length: `256` })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
};
