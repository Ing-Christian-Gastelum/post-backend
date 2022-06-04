import { Posts } from 'src/modules/posts/entities/post.entity';
import { Users } from 'src/modules/users/entities/user.entity';
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

@Entity('comments')
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @Column({
    unique: true,
    nullable: true,
  })
  value: string;

  @OneToMany(() => Comment, (comment) => comment.comment)
  private comments: Comment[];

  @ManyToOne(() => Comment, (comment) => comment.comments, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'commentId' })
  comment: Comment;
  @Column()
  commentId: number;

  @ManyToOne(() => Posts, (post) => post.comment, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'postId' })
  post: Posts;
  @Column()
  postId: number;

  @ManyToOne(() => Users, (user) => user.posts, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'userId' })
  user: Users;
  @Column({
    nullable: false,
  })
  userId: string;
}
