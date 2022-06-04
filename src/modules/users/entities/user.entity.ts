import { Posts } from 'src/modules/posts/entities/post.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class Users extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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
  username: string;

  @Column({
    nullable: true,
  })
  password: string;

  @Column({
    nullable: true,
  })
  permission: string;

  @OneToMany(() => Posts, (post) => post.user)
  public posts: Posts[];
}
