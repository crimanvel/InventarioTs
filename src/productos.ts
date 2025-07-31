// Definimos una interfaz llamada 'Categoria'.
// Las interfaces en TypeScript se usan para describir la forma de los objetos.
export interface Categoria {
  id: number;           // Identificador único de la categoría.
  nombre: string;       // Nombre de la categoría, como 'Electrónica'.
  stock: number;        // Cantidad disponible en stock dentro de esta categoría.
}

// Definimos una interfaz llamada 'Producto'.
export interface Producto {
  id: number;               // Identificador único del producto.
  nombre: string;           // Nombre del producto, como 'Smartphone X'.
  precio: number;           // Precio del producto.
  disponible: boolean;      // Indica si el producto está disponible (true) o no (false).
  categorias: Categoria[];  // Array de categorías asociadas al producto.
}

// Creamos una constante 'productos' que es un array de objetos que cumplen la estructura de la interfaz 'Producto'.
export const productos: Producto[] = [
  {
    id: 1,                        // Producto 1: Smartphone X
    nombre: "Smartphone X",      // Nombre del producto
    precio: 1200,                // Precio en la moneda definida (ej. USD)
    categorias: [                // Categorías en las que este producto aparece
      { id: 1, nombre: "Electrónica", stock: 50 },
      { id: 2, nombre: "Accesorios", stock: 100 }
    ],
    disponible: true             // Está disponible para la venta
  },
  {
    id: 2,                        // Producto 2: Laptop Pro
    nombre: "Laptop Pro",
    precio: 2500,
    categorias: [
      { id: 1, nombre: "Computadoras", stock: 20 },
      { id: 2, nombre: "Electrónica", stock: 30 }
    ],
    disponible: true
  },
  {
    id: 3,                        // Producto 3: Auriculares Inalámbricos
    nombre: "Auriculares Inalámbricos",
    precio: 800,
    categorias: [
      { id: 1, nombre: "Audio", stock: 75 },
      { id: 2, nombre: "Accesorios", stock: 150 }
    ],
    disponible: false            // Este producto NO está disponible actualmente
  }
];
