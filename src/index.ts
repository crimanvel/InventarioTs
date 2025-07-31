import express, { Request, Response } from 'express';
import { productos, Producto, Categoria } from './productos';

const app = express();
const PORT = 3000;

app.use(express.json());

// 🏁 Mensaje de inicio
app.get('/', (_req: Request, res: Response): void => {
  res.send('¡API de Inventario funcionando!');
});

// 📦 Listar todos los productos
app.get('/productos', (_req: Request, res: Response): void => {
  res.json(productos);
});

// 🌟 Productos destacados (disponible y precio >= 1000)
app.get('/productos/destacados', (_req: Request, res: Response): void => {
  const destacados: Producto[] = productos.filter(
    (p: Producto) => p.disponible && p.precio >= 1000
  );

  console.log('→ Productos destacados:', destacados);

  if (destacados.length === 0) {
    res.status(404).json({ error: 'No hay productos destacados disponibles' });
    return;
  }

  res.json(destacados);
});

// 🧪 Filtrar por categoría
app.get('/productos/categoria/:nombre', (req: Request<{ nombre: string }>, res: Response): void => {
  const nombreCategoria: string = req.params.nombre.toLowerCase();

  const filtrados: Producto[] = productos.filter((p: Producto) =>
    p.categorias.some((c: Categoria) => c.nombre.toLowerCase() === nombreCategoria)
  );

  res.json(filtrados);
});

// 🔍 Buscar producto por ID
app.get('/productos/:id', (req: Request<{ id: string }>, res: Response): void => {
  const id: number = parseInt(req.params.id);
  const producto: Producto | undefined = productos.find((p: Producto) => p.id === id);

  if (!producto) {
    res.status(404).json({ error: 'Producto no encontrado' });
    return;
  }

  res.json(producto);
});

// 🆕 Agregar nuevo producto
app.post('/productos', (req: Request, res: Response): void => {
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

  const nuevoProducto: Producto = {
    id: productos.length + 1,
    nombre,
    precio,
    disponible,
    categorias
  };

  productos.push(nuevoProducto);
  console.log('→ Nuevo producto agregado:', nuevoProducto);
  res.status(201).json(nuevoProducto);
});

// ✏️ Actualizar producto por ID
app.put('/productos/:id', (req: Request<{ id: string }>, res: Response): void => {
  const id: number = parseInt(req.params.id);
  const producto: Producto | undefined = productos.find((p: Producto) => p.id === id);

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
  if (categorias !== undefined) producto.categorias = categorias;

  console.log('→ Producto actualizado:', producto);
  res.json(producto);
});

// ❌ Eliminar producto por ID
app.delete('/productos/:id', (req: Request<{ id: string }>, res: Response): void => {
  const id: number = parseInt(req.params.id);
  const index: number = productos.findIndex((p: Producto) => p.id === id);

  if (index === -1) {
    res.status(404).json({ error: 'Producto no encontrado' });
    return;
  }

  const eliminado: Producto = productos.splice(index, 1)[0];
  console.log('→ Producto eliminado:', eliminado);
  res.json(eliminado);
});

// 🐛 Ruta para inspección en tiempo real
app.get('/debug/productos', (_req: Request, res: Response): void => {
  console.log('→ Estado actual de productos:', productos);
  res.json(productos);
});

// 🚀 Servidor arriba
app.listen(PORT, (): void => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
