import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { EstadosProyectosEnum } from "../enums/estados-proyectos.enum";
import { Cliente } from "./cliente.entity";
import { Tarea } from "./tarea.entity";
import { Columna } from "./columna.entity";

@Entity({ name: "proyectos" })
export class Proyecto {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    nombre!: string;

    @Column({ type: 'enum', enum: EstadosProyectosEnum })
    estado!: EstadosProyectosEnum

    @Column({ name: "id_cliente", nullable: true })
    idCliente!: number | null;

    @Column({ name: "fecha_finalizacion_objetivo", type: "date", nullable: true })
    fechaFinalizacionObjetivo?: Date | null;

    @ManyToOne(()=>Cliente)
    @JoinColumn({name: "id_cliente"})
    cliente!: Cliente

    @OneToMany(()=>Tarea, (tarea)=> tarea.proyecto)
    tareas!: Tarea[]

    @OneToMany(()=>Columna, (columna)=> columna.proyecto, { cascade: true })
    columnas!: Columna[]

}