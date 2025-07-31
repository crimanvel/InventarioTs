export interface Categoria {
  id: number;
  nombre: string;
  stock: number;
}

export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  disponible: boolean;
  categorias: Categoria[];
}

export const productos: Producto[] = [
  {
    id: 1,
    nombre: "Smartphone X",
    precio: 1200,
    categorias: [
      { id: 1, nombre: "Electrónica", stock: 50 },
      { id: 2, nombre: "Accesorios", stock: 100 }
    ],
    disponible: true
  },
  {
    id: 2,
    nombre: "Laptop Pro",
    precio: 2500,
    categorias: [
      { id: 1, nombre: "Computadoras", stock: 20 },
      { id: 2, nombre: "Electrónica", stock: 30 }
    ],
    disponible: true
  },
  {
    id: 3,
    nombre: "Auriculares Inalámbricos",
    precio: 800,
    categorias: [
      { id: 1, nombre: "Audio", stock: 75 },
      { id: 2, nombre: "Accesorios", stock: 150 }
    ],
    disponible: false
  }
];
