// 1. Interfaz Animal con método gritar que retorna string
interface Animal {
    nombre: string;
    gritar(): string;
}

// 2. Clases que implementan la interfaz Animal
class Perro implements Animal {
    constructor(public nombre: string) {}
    gritar(): string {
        return "¡Guau!";
    }
}

class Gato implements Animal {
    constructor(public nombre: string) {}
    gritar(): string {
        return "¡Miau!";
    }
}

class Vaca implements Animal {
    constructor(public nombre: string) {}
    gritar(): string {
        return "¡Muuu!";
    }
}

// 3. Función describirAnimal con el formato de impresión exacto solicitado
function describirAnimal(animal: Animal): void {
    // Debe imprimir: "El animal [nombre] hace [ruido]"
    console.log(`El animal ${animal.nombre} hace ${animal.gritar()}`);
}

// 4. Constantes con instancia y tipo de datos declarado
const perro: Perro = new Perro("Rocco");
const vaca: Vaca = new Vaca("Lola");
const gato: Gato = new Gato("Mishi");

// 5. Ejecución del método describirAnimal para cada constante
describirAnimal(perro);
describirAnimal(vaca);
describirAnimal(gato);