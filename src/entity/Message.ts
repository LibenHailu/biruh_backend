import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from './User'

@Entity('messages')
export class Message extends BaseEntity {
    constructor(message: Partial<Message>) {
        super();
        Object.assign(this, message)
    }

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    message: string;

    @Column()
    status: string;

    @ManyToOne(() => User, user => user.sent)
    sender: User;

    @ManyToOne(() => User, user => user.received)
    receiver: User;

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @DeleteDateColumn()
    deletedAt: Date
}
