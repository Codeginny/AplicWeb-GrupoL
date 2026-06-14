import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { EstadosTareasEnum } from "../enums/estados-tareas.enum";
import { Proyecto } from "./proyecto.entity";
import { Columna } from "./columna.entity";
import { MetaIntermedia } from "./meta-intermedia.entity";

@Entity({ name: "tareas" })
export class Tarea {

    @PrimaryGeneratedColumn({ name: "id" })
    id!: number;

    @Column()
    descripcion!: string;

    @Column({ name: "estado", type: "enum", enum: EstadosTareasEnum, nullable: true })
    estado!: EstadosTareasEnum | null;

    @Column({ name: "id_columna", nullable: true })
    idColumna!: number | null;

    @ManyToOne(() => Columna, (columna) => columna.tareas, { onDelete: "SET NULL" })
    @JoinColumn({ name: "id_columna" })
    columna!: Columna | null;

    @Column({ name: "id_proyecto" })
    idProyecto!: number;

    @Column({ name: 'id_meta_intermedia', nullable: true })
    idMetaIntermedia?: number | null;

    @ManyToOne(() => MetaIntermedia, (meta) => meta.tareas)
    @JoinColumn({ name: 'id_meta_intermedia' })
    metaIntermedia?: MetaIntermedia;

    @ManyToOne(()=>Proyecto)
    @JoinColumn({name:"id_proyecto"})
    proyecto!: Proyecto

    @Column({ type: "varchar", nullable: true })
    prioridad!: "Alta" | "Media" | "Baja" | null;

    @Column({ type: "varchar", nullable: true })
    responsable!: string | null;

    @Column({ name: "fecha_entrega", type: "date", nullable: true })
    fechaEntrega!: string | null;

}