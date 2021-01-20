import { IsEmail, Length, Min } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, Index, CreateDateColumn, UpdateDateColumn, BeforeInsert } from "typeorm";
import { classToPlain, Exclude } from 'class-transformer'
import bcrypt from 'bcrypt'

@Entity("users")
export class User extends BaseEntity {
    constructor(user: Partial<User>) {
        super()
        Object.assign(this, user)
    }

    @Exclude()
    @PrimaryGeneratedColumn()
    id: number;

    @Index()
    @IsEmail()
    @Column({ unique: true })
    email: string;

    @Exclude()
    @Index()
    @Length(3, 255)
    @Column({ unique: true })
    username: string;

    @Column()
    @Length(6, 255)
    password: string;

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10)
    }

    toJSON() {
        return classToPlain(this)
    }

}
