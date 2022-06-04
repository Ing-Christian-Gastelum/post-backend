import { Users } from 'src/modules/users/entities/user.entity';
import { Comments } from 'src/modules/comments/entities/comment.entity';

import {
  BaseEntity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  Entity,
  OneToMany,
} from 'typeorm';

@Entity('posts')
export class Posts extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @Column({
    nullable: true,
  })
  value: string;

  @OneToMany(() => Comments, (comment) => comment.post)
  public comment: Comments[];

  @ManyToOne(() => Users, (user) => user.posts, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'userId' })
  user: Users;
  @Column()
  userId: string;
}
