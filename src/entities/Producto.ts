import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Categoria } from './Categoria';

@Entity()
export class Producto {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nombre!: string;

  @Column('float')
  precio!: number;

  @Column()
  disponible!: boolean;

  @ManyToMany(() => Categoria, { cascade: true })
  @JoinTable()
  categorias!: Categoria[];
}
