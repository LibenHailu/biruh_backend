import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User";

export type MaritalStatus = "Single" | "Married" | "Widowed" | "Divorced"

@Entity('user_filter')
export class UserFilter extends BaseEntity {
    constructor(userFilter: Partial<UserFilter>) {
        super()
        Object.assign(this, userFilter)
    }

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Index()
    @Column({
        type: "enum",
        enum: ["Single", "Married", "Widowed", "Divorced"],
        default: "Single"
    })
    marital_status: MaritalStatus

    @Index()
    @Column()
    city: string

    @Index()
    @Column()
    age: number

    @Index()
    @Column("text", { array: true, default: "{}" })
    profession: string[]

    @Index()
    @Column()
    sex: string

    @ManyToOne(() => User, user => user.user_filters)
    user: User;

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @DeleteDateColumn()
    deletedAt: Date
}
