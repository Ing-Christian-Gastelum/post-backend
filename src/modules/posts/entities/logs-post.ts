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
import { Users } from 'src/modules/users/entities/user.entity';
import { Posts } from './post.entity';

@Entity('post_logs')
export class logsPosts extends BaseEntity {
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
  event: string;
}
