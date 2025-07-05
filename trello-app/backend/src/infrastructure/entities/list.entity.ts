import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { BoardEntity } from './board.entity';

@Entity('lists')
export class ListEntity {
  @PrimaryColumn()
  id: string;

  @Column({ name: 'board_id' })
  boardId: string;

  @Column()
  title: string;

  @Column()
  position: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => BoardEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'board_id' })
  board: BoardEntity;
}