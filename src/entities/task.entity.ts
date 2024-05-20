import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'tasks' })
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: ['in-progress', 'active', 'completed', 'closed', 'drafted'],
    default: 'in-progress',
  })
  status: string;

  @Column({ nullable: true })
  content?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.tasks) user: User;

  toPayload(): Partial<Task> {
    return {
      id: this.id,
      userId: this.userId,
      title: this.title,
      description: this.description,
      status: this.status,
      content: this.content,
      createdAt: this.createdAt,
    };
  }
}
