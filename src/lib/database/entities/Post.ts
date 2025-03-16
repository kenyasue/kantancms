import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
// Forward reference to User to avoid circular dependency
import type { User } from './User';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  parentId: string;

  @Column()
  userId: string;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  modifiedAt: Date;

  @ManyToOne(() => Post, post => post.id, { nullable: true })
  @JoinColumn({ name: 'parentId' })
  parent: Post;

  @ManyToOne('User', 'posts')
  @JoinColumn({ name: 'userId' })
  user: User;
}
