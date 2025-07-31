// Importamos express y los tipos Request y Response para tipar correctamente nuestras rutas.
import express, { Request, Response } from 'express';

// Importamos el array de productos y las interfaces Producto y Categoria para poder usarlos dentro del servidor.
import { productos, Producto, Categoria } from './productos';

// Creamos una instancia de la aplicación Express.
const app = express();

// Definimos el puerto en el que va a escuchar la API.
const PORT = 3000;

// Middleware que permite a Express interpretar cuerpos en formato JSON.
app.use(express.json());

// Ruta raíz: responde con un simple mensaje para confirmar que la API está en funcionamiento.
app.get('/', (_req: Request, res: Response): void => {
  res.send('¡API de Inventario funcionando!');
});

// Ruta para obtener todos los productos existentes.
app.get('/productos', (_req: Request, res: Response): void => {
  res.json(productos); // Devuelve el array completo de productos como JSON.
});

// Ruta para obtener solo los productos destacados.
// Se considera "destacado" si está disponible y su precio es mayor o igual a 1000.
app.get('/productos/destacados', (_req: Request, res: Response): void => {
  const destacados: Producto[] = productos.filter(
    (p: Producto) => p.disponible && p.precio >= 1000
  );

  // Muestra en consola los productos destacados encontrados.
  console.log('→ Productos destacados:', destacados);

  // Si no hay ninguno, responde con un error 404.
  if (destacados.length === 0) {
    res.status(404).json({ error: 'No hay productos destacados disponibles' });
    return;
  }

  // Devuelve los productos destacados en formato JSON.
  res.json(destacados);
});

// Ruta para obtener productos que pertenecen a una categoría específica (por nombre).
app.get('/productos/categoria/:nombre', (req: Request<{ nombre: string }>, res: Response): void => {
  const nombreCategoria: string = req.params.nombre.toLowerCase(); // Convertimos a minúsculas para evitar problemas de mayúsculas.

  // Filtramos los productos cuya lista de categorías incluye una con el nombre solicitado.
  const filtrados: Producto[] = productos.filter((p: Producto) =>
    p.categorias.some((c: Categoria) => c.nombre.toLowerCase() === nombreCategoria)
  );

  res.json(filtrados); // Respondemos con la lista filtrada.
});

// Ruta para obtener un producto por su ID.
app.get('/productos/:id', (req: Request<{ id: string }>, res: Response): void => {
  const id: number = parseInt(req.params.id); // Convertimos el ID recibido como string a número.
  const producto: Producto | undefined = productos.find((p: Producto) => p.id === id);

  // Si no se encuentra el producto, se responde con error 404.
  if (!producto) {
    res.status(404).json({ error: 'Producto no encontrado' });
    return;
  }

  // Si se encuentra, se devuelve el producto.
  res.json(producto);
});

// Ruta para agregar un nuevo producto (método POST).
app.post('/productos', (req: Request, res: Response): void => {
  const { nombre, precio, disponible, categorias } = req.body; // Extraemos datos del cuerpo del request.

  // Validamos que los datos tengan el tipo adecuado y valores razonables.
  if (
    typeof nombre !== 'string' ||
    typeof precio !== 'number' ||
    precio < 0 ||
    typeof disponible !== 'boolean' ||
    !Array.isArray(categorias)
  ) {
    res.status(400).json({ error: 'Datos inválidos' }); // Respondemos con error si algo está mal.
    return;
  }

  // Creamos el nuevo producto con un ID calculado automáticamente.
  const nuevoProducto: Producto = {
    id: productos.length + 1,
    nombre,
    precio,
    disponible,
    categorias
  };

  productos.push(nuevoProducto); // Lo agregamos al array de productos.
  console.log('→ Nuevo producto agregado:', nuevoProducto); // Lo mostramos en consola.
  res.status(201).json(nuevoProducto); // Respondemos con el nuevo producto creado.
});

// Ruta para actualizar un producto existente por su ID (método PUT).
app.put('/productos/:id', (req: Request<{ id: string }>, res: Response): void => {
  const id: number = parseInt(req.params.id);
  const producto: Producto | undefined = productos.find((p: Producto) => p.id === id);

  // Si no se encuentra el producto, se responde con error.
  if (!producto) {
    res.status(404).json({ error: 'Producto no encontrado' });
    return;
  }

  const { nombre, precio, disponible, categorias } = req.body;

  // Validamos cada campo que se quiere modificar (solo si están presentes).
  if (
    (nombre !== undefined && typeof nombre !== 'string') ||
    (precio !== undefined && (typeof precio !== 'number' || precio < 0)) ||
    (disponible !== undefined && typeof disponible !== 'boolean') ||
    (categorias !== undefined && !Array.isArray(categorias))
  ) {
    res.status(400).json({ error: 'Datos inválidos para actualizar' });
    return;
  }

  // Si los valores son válidos, actualizamos solo los campos que se enviaron.
  if (nombre !== undefined) producto.nombre = nombre;
  if (precio !== undefined) producto.precio = precio;
  if (disponible !== undefined) producto.disponible = disponible;
  if (categorias !== undefined) producto.categorias = categorias;

  console.log('→ Producto actualizado:', producto); // Mostramos el nuevo estado.
  res.json(producto); // Respondemos con el producto actualizado.
});

// Ruta para eliminar un producto por su ID.
app.delete('/productos/:id', (req: Request<{ id: string }>, res: Response): void => {
  const id: number = parseInt(req.params.id);
  const index: number = productos.findIndex((p: Producto) => p.id === id);

  // Si no se encuentra, se responde con error.
  if (index === -1) {
    res.status(404).json({ error: 'Producto no encontrado' });
    return;
  }

  // Eliminamos el producto y lo mostramos.
  const eliminado: Producto = productos.splice(index, 1)[0];
  console.log('→ Producto eliminado:', eliminado);
  res.json(eliminado); // Respondemos con el producto eliminado.
});

// Ruta para debug: imprime en consola el estado completo del array de productos.
app.get('/debug/productos', (_req: Request, res: Response): void => {
  console.log('→ Estado actual de productos:', productos);
  res.json(productos);
});

// Iniciamos el servidor Express en el puerto definido, y mostramos el mensaje en consola.
app.listen(PORT, (): void => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
