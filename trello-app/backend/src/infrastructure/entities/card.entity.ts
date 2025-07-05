import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ListEntity } from './list.entity';

@Entity('cards')
export class CardEntity {
  @PrimaryColumn()
  id: string;

  @Column({ name: 'list_id' })
  listId: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  position: number;

  @Column({ name: 'due_date', type: 'datetime', nullable: true })
  dueDate: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => ListEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'list_id' })
  list: ListEntity;
}