import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Proyecto } from './proyecto.entity';
import { Tarea } from './tarea.entity';

@Entity({ name: 'metas_intermedias' })
export class MetaIntermedia {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    nombre!: string;

    @Column({ type: 'text', nullable: true })
    descripcion?: string;

    @Column({ name: 'id_proyecto' })
    idProyecto!: number;

    @ManyToOne(() => Proyecto)
    @JoinColumn({ name: 'id_proyecto' })
    proyecto!: Proyecto;

    @OneToMany(() => Tarea, (tarea) => tarea.metaIntermedia)
    tareas!: Tarea[];
}