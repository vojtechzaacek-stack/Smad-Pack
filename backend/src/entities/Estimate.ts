import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Item } from './Item';

@Entity('estimates')
export class Estimate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'varchar' })
  condition: string;

  @Column({ type: 'varchar' })
  rarity: string;

  @Column({ type: 'text', nullable: true })
  aiAnalysis: string;

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any>;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  confidence: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Item, (item) => item.estimates, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'itemId' })
  item: Item;

  @Column({ type: 'uuid' })
  itemId: string;
}
