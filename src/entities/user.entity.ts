import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Task } from './task.entity';
import * as argon from 'argon2';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  refreshToken?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];

  toPayload(): Partial<User> {
    return {
      id: this.id,
      email: this.email,
      createdAt: this.createdAt,
    };
  }

  async correctPassword(userPassword: string, password: string) {
    console.log(userPassword, 'userPassword');
    console.log(password, 'passowrd');
    const verifyPassword = await argon.verify(password, userPassword);
    console.log(verifyPassword);
    return verifyPassword;
  }
}
