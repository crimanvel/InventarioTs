import express, { Request, Response } from 'express';
import { AppDataSource } from './data-source';
import { Producto } from './entities/Producto';
import { Categoria } from './entities/Categoria';

const app = express();
const PORT = 3000;

app.use(express.json());

// Inicializamos la conexión con la base de datos
AppDataSource.initialize().then(() => {
  console.log('📦 Base de datos conectada');

  // Ruta raíz
  app.get('/', (_req, res) => {
    res.send('¡API con TypeORM y SQLite funcionando!');
  });

  // Obtener todos los productos
  app.get('/productos', async (_req, res) => {
    const productos = await AppDataSource.getRepository(Producto).find({ relations: ['categorias'] });
    res.json(productos);
  });

  // Obtener productos destacados
  app.get('/productos/destacados', async (_req, res) => {
    const productos = await AppDataSource.getRepository(Producto).find({ where: { disponible: true }, relations: ['categorias'] });
    const destacados = productos.filter((p) => p.precio >= 1000);

    if (destacados.length === 0) {
      res.status(404).json({ error: 'No hay productos destacados disponibles' });
      return;
    }

    res.json(destacados);
  });

  // Obtener productos por categoría
  app.get('/productos/categoria/:nombre', async (req: Request, res: Response) => {
    const nombreCategoria = req.params.nombre.toLowerCase();
    const productos = await AppDataSource.getRepository(Producto).find({ relations: ['categorias'] });

    const filtrados = productos.filter((p) =>
      p.categorias.some((c) => c.nombre.toLowerCase() === nombreCategoria)
    );

    res.json(filtrados);
  });

  // Obtener producto por ID
  app.get('/productos/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const producto = await AppDataSource.getRepository(Producto).findOne({
      where: { id },
      relations: ['categorias'],
    });

    if (!producto) {
      res.status(404).json({ error: 'Producto no encontrado' });
      return;
    }

    res.json(producto);
  });

  // Crear nuevo producto
  app.post('/productos', async (req: Request, res: Response) => {
    const { nombre, precio, disponible, categorias } = req.body;

    if (
      typeof nombre !== 'string' ||
      typeof precio !== 'number' ||
      precio < 0 ||
      typeof disponible !== 'boolean' ||
      !Array.isArray(categorias)
    ) {
      res.status(400).json({ error: 'Datos inválidos' });
      return;
    }

    const nuevasCategorias = categorias.map((c: Categoria) => {
      const cat = new Categoria();
      cat.nombre = c.nombre;
      cat.stock = c.stock;
      return cat;
    });

    const producto = new Producto();
    producto.nombre = nombre;
    producto.precio = precio;
    producto.disponible = disponible;
    producto.categorias = nuevasCategorias;

    await AppDataSource.getRepository(Producto).save(producto);
    res.status(201).json(producto);
  });

  // Actualizar producto por ID
  app.put('/productos/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const repo = AppDataSource.getRepository(Producto);
    const producto = await repo.findOne({ where: { id }, relations: ['categorias'] });

    if (!producto) {
      res.status(404).json({ error: 'Producto no encontrado' });
      return;
    }

    const { nombre, precio, disponible, categorias } = req.body;

    if (
      (nombre !== undefined && typeof nombre !== 'string') ||
      (precio !== undefined && (typeof precio !== 'number' || precio < 0)) ||
      (disponible !== undefined && typeof disponible !== 'boolean') ||
      (categorias !== undefined && !Array.isArray(categorias))
    ) {
      res.status(400).json({ error: 'Datos inválidos para actualizar' });
      return;
    }

    if (nombre !== undefined) producto.nombre = nombre;
    if (precio !== undefined) producto.precio = precio;
    if (disponible !== undefined) producto.disponible = disponible;
    if (categorias !== undefined) {
      producto.categorias = categorias.map((c: Categoria) => {
        const cat = new Categoria();
        cat.nombre = c.nombre;
        cat.stock = c.stock;
        return cat;
      });
    }

    await repo.save(producto);
    res.json(producto);
  });

  // Eliminar producto por ID
  app.delete('/productos/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const repo = AppDataSource.getRepository(Producto);
    const producto = await repo.findOne({ where: { id } });

    if (!producto) {
      res.status(404).json({ error: 'Producto no encontrado' });
      return;
    }

    await repo.remove(producto);
    res.json(producto);
  });

  // Ruta de debug
  app.get('/debug/productos', async (_req: Request, res: Response) => {
    const productos = await AppDataSource.getRepository(Producto).find({ relations: ['categorias'] });
    console.log('→ Estado actual de productos:', productos);
    res.json(productos);
  });

  // Iniciar servidor
  app.listen(PORT, () => {
    console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
  });
}).catch((error) => console.error('❌ Error al conectar la base de datos:', error));
