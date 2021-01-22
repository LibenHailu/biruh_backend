import { IsEmail, Length } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, Index, CreateDateColumn, UpdateDateColumn, BeforeInsert } from "typeorm";
import { classToPlain, Exclude } from 'class-transformer'
import bcrypt from 'bcrypt'

export type UserRoleType = "admin" | "editor" | "ghost"
export type UserInterests = "Swimming" | "Cooking" | "Workout"
export type MaritalStatus = "Single" | "Married" | "Widowed" | "Divorced"

@Entity("users")
export class User extends BaseEntity {
    constructor(user: Partial<User>) {
        super()
        Object.assign(this, user)
    }

    @Exclude()
    @PrimaryGeneratedColumn()
    id: number

    @Index()
    @IsEmail()
    @Column({ unique: true })
    email: string

    @Exclude()
    @Index()
    @Length(3, 255)
    @Column({ unique: true })
    username: string

    @Column()
    @Length(6, 255)
    password: string

    @Column({
        type: "enum",
        enum: ["admin", "user"],
        default: "user"
    })
    role: UserRoleType

    @Column("text", { array: true, default: "{}" })
    profession: string[]

    @Column({
        type: "enum",
        enum: ["Swimming", "Cooking", "Workout"],
        array: true,
        default: []
    })
    interests: UserInterests[]

    @Column()
    firstname: string

    @Column()
    lastname: string

    @Column({
        type: "enum",
        enum: ["Single", "Married", "Widowed", "Divorced"],
        default: "Single"
    })
    marital_status: MaritalStatus

    @Column()
    city: string

    @Column({
        nullable: true
    })
    bio: string

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
