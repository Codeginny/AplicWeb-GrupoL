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

//9 Crear una fila para números, una fila para strings, y una fila para animales (declarando los tipos correspondientes en cada variable)

let filaNumeros = new FilaGenerica<number>();
let filaStrings = new FilaGenerica<string>();
let filaAnimales = new FilaGenerica<Animal>();


//10 - En la fila para animales, agregar las 3 instancias que fueron creadas con anterioridad.
//En las otras 2 filas, agregar 3 elementos a elección en cada una. Para finalizar,
//remover un elemento de cada una de las 3 filas.

console.log("----------------------------Elementos agregados al a Fila animales");
filaAnimales.agregar(perro)
filaAnimales.agregar(vaca)
filaAnimales.agregar(gato)

console.log("----------------------------Elementos en la fila de números:");
filaNumeros.agregar(0);
filaNumeros.agregar(1); 
filaNumeros.agregar(2);

console.log("----------------------------Elementos en la fila de strings:");
filaStrings.agregar("Hola");
filaStrings.agregar("Mundo");  
filaStrings.agregar("!");

console.log("----------------------------1 Elemento removido de cada Fila:");
filaAnimales.remover();
filaNumeros.remover();
filaStrings.remover();