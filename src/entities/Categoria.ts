import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Categoria {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nombre!: string;

  @Column()
  stock!: number;
}
