import { BaseEntity, Column, CreateDateColumn, Entity, Generated, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { IsEmail, IsOptional, IsString } from 'class-validator';

@Entity()
export class Users extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, length: 255, nullable: true, })
    @IsString()
    @IsOptional()
    name: string;

    @Column({ unique: true, length: 150 })
    @IsEmail()
    email: string;

    @Column({default: ""})
    phone: string;

    @Column()
    @IsString()
    password: string;
 
    @Column()
    @IsString()
    @IsOptional()
    salt: string;

    @Column({ default: "" })
    @IsString()
    @IsOptional()
    profile_image: string;

    
    @Column('boolean', {default: true})
    is_active: boolean = true;

    @Column('boolean', {default: false})
    is_verified: boolean = true;

    @Column('boolean', {default: false})
    is_deleted: boolean = false;

    @CreateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP(6)" })
    created_at: Date;

    @UpdateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    updated_at: Date; 
}