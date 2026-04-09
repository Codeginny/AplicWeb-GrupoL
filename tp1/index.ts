// 1. Interfaz Animal con método gritar que retorna string
interface Animal {
  nombre: string;
  gritar(): string;
}

// 2. Clases que implementan la interfaz Animal
class Perro implements Animal {
  constructor(public nombre: string) { }
  gritar(): string {
    return "Guau!";
  }
}

class Gato implements Animal {
  constructor(public nombre: string) { }
  gritar(): string {
    return "Miau!";
  }
}

class Vaca implements Animal {
  constructor(public nombre: string) { }
  gritar(): string {
    return "Muuu!";
  }
}

// 3. Función describirAnimal con el formato de impresión exacto solicitado
function describirAnimal(animal: Animal): void {
  // Debe imprimir: "El animal [nombre] hace [ruido]"
  console.log(`El animal ${animal.nombre} hace ${animal.gritar()}`);
}

// 4. Constantes con instancias de las clases correspondientes
const perro: Perro = new Perro("Albondiga");
const vaca: Vaca = new Vaca("Margarita");
const gato: Gato = new Gato("Don Gato");

// 5. Ejecutar el método “describirAnimal” para cada una de las constantes creadas (3 veces en total).
describirAnimal(perro);
describirAnimal(vaca);
describirAnimal(gato);

// 6. Enum con los días de la semana
enum DiasSemana {
  Lunes,
  Martes,
  Miercoles,
  Jueves,
  Viernes,
  Sabado,
  Domingo
}

// 7. Variable que acepta string o number
let variable: number | string;
variable = "Messi";
variable = 10;


// 8. Interfaz y clase genérica
interface Fila<T> {
  agregar(elemento: T): void;
  remover(): T | undefined;
}

class FilaGenerica<T> implements Fila<T> {
  private elementos: T[] = [];

  /** Agrega un elemento al final de la fila */
  agregar(elemento: T): void {
    this.elementos.push(elemento);
  }

  /**
   * Remueve y retorna el primer elemento de la fila.
   * Retorna `undefined` si la fila está vacía.
   */
  remover(): T | undefined {
    return this.elementos.shift();
  }
}