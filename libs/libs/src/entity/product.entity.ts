import { IsNumber, IsOptional, IsString } from "class-validator";
import { BaseEntity, Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Products extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    user_id: number;

    @Column()
    @IsString()
    name: string;

    @Column({ default: '' })
    @IsString()
    @IsOptional()
    description: string;

    @Column()
    @IsString()
    price: string;

    @Column()
    @IsNumber()
    stock: number;

    @Column('boolean', { default: false })
    is_deleted: boolean;

    @Column({ default: 0 })
    created_by: number;

    @Column({ default: 0 })
    updated_by: number;

    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP(6)' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)' })
    updated_at: Date;
}