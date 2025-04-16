import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsNumber, IsString, MaxLength } from 'class-validator';

@Entity()
export class Session extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNumber()
  user_id: number;

  @Column({ length: 255 })
  @MaxLength(50)
  @IsString()
  token: string;

  @Column({ type: 'timestamp', default: () => 'now()' })
  expire_at: Date;

  @Column('boolean', { default: false })
  is_deleted = false;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP(6)' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: "CURRENT_TIMESTAMP(6)" })
  updatd_at: Date;
}
