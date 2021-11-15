import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
