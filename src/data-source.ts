import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Producto } from './entities/Producto';
import { Categoria } from './entities/Categoria';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'inventario.sqlite',
  synchronize: true, // Solo para desarrollo: crea tablas automáticamente
  entities: [Producto, Categoria],
});
