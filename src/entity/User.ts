import { IsEmail, Length } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, Index, CreateDateColumn, UpdateDateColumn, BeforeInsert, In, DeleteDateColumn, OneToMany } from "typeorm";
import { classToPlain, Exclude } from 'class-transformer'
import bcrypt from 'bcrypt'
import { Message } from "./Message";
import { Notification } from "./Notification";
import { UserFilter } from "./UserFilter";

export type UserRoleType = "admin" | "editor" | "ghost"
export type UserInterests = "Swimming" | "Cooking" | "Workout"
export type MaritalStatus = "Single" | "Married" | "Widowed" | "Divorced"


@Entity("users")
export class User extends BaseEntity {
    constructor(user: Partial<User>) {
        super()
        Object.assign(this, user)
    }

    @Index()
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Index()
    @IsEmail()
    @Column({ unique: true, nullable: true })
    email: string

    @Index()
    @Column({ unique: true })
    phone: string

    @Column({
        type: "enum",
        enum: ["admin", "user"],
        default: "user"
    })
    role: UserRoleType

    @Index()
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

    @Column()
    sex: string


    @Column({
        nullable: true
    })
    bio: string

    @Column()
    age: number

    @OneToMany(() => Message, message => message.sender)
    sent: Message[];

    @OneToMany(() => Message, message => message.receiver)
    received: Message[];

    @OneToMany(() => Notification, notification => notification.user)
    notifications: Notification[];

    @OneToMany(() => UserFilter, userFilter => userFilter.user)
    user_filters: UserFilter[];

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @DeleteDateColumn()
    deletedAt: Date

    toJSON() {
        return classToPlain(this)
    }

}
