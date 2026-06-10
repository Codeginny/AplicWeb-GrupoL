import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { EstadosTareasEnum } from "../enums/estados-tareas.enum";
import { Proyecto } from "./proyecto.entity";
import { MetaIntermedia } from "./meta-intermedia.entity";

@Entity({ name: "tareas" })
export class Tarea {

    @PrimaryGeneratedColumn({ name: "id" })
    id!: number;

    @Column()
    descripcion!: string;

    @Column({ name: "estado", type: "enum", enum: EstadosTareasEnum })
    estado!: EstadosTareasEnum;

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


}