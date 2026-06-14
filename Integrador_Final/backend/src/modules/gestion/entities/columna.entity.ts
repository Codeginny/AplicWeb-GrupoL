import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Proyecto } from "./proyecto.entity";
import { Tarea } from "./tarea.entity";

@Entity({ name: "columnas" })
export class Columna {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    nombre!: string;

    @Column({ default: 0 })
    orden!: number;

    @Column({ name: "id_proyecto" })
    idProyecto!: number;

    @ManyToOne(() => Proyecto, (proyecto) => proyecto.columnas, { onDelete: "CASCADE" })
    @JoinColumn({ name: "id_proyecto" })
    proyecto!: Proyecto;

    @OneToMany(() => Tarea, (tarea) => tarea.columna, { cascade: true })
    tareas!: Tarea[];
}
