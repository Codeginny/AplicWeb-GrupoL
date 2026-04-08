interface Animal {
    nombre: string;
    hacerSonido(): void;
}

class Perro implements Animal {
    constructor(public nombre: string) {}

    hacerSonido(): void {
        console.log("¡Guau! ¡Guau!");
    }
}

class Gato implements Animal {
    constructor(public nombre: string) {}

    hacerSonido(): void {
        console.log("¡Miau!");
    }
}

class Vaca implements Animal {
    constructor(public nombre: string) {}

    hacerSonido(): void {
        console.log("¡Muuu!");
    }
}

function describirAnimal(animal: Animal): void {
    console.log(`Este animal se llama: ${animal.nombre}`);
    animal.hacerSonido();
}

const miPerro = new Perro("Choco");
const miGato = new Gato("Mishi");

describirAnimal(miPerro);
describirAnimal(miGato);
