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
export class Comments extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @Column({
    nullable: false,
  })
  value: string;

  @ManyToOne(() => Comments, (comment) => comment.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'commentId' })
  comment: Comments;
  @Column({ nullable: true })
  commentId: number;

  @OneToMany(() => Comments, (comment) => comment.comment)
  public comments: Comments[];

  @ManyToOne(() => Posts, (post) => post.comment, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'postId' })
  post: Posts;
  @Column({ nullable: true })
  postId: number;
}
