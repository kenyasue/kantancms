import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
// Forward reference to Post to avoid circular dependency
import type { Post } from './Post';
import * as bcrypt from 'bcrypt';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ nullable: true, type: 'varchar', default: null })
  avatar: string | null;

  @Column({ type: 'varchar', default: 'system' })
  theme: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  modifiedAt: Date;

  @OneToMany('Post', 'user')
  posts: Post[];

  // Method to hash password before saving
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  // Method to validate password
  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
