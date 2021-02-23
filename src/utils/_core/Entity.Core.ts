import { Field, ID, ObjectType } from 'type-graphql';
import { Column, CreateDateColumn, DeleteDateColumn, ManyToOne, PrimaryGeneratedColumn, VersionColumn } from 'typeorm';
import { User } from '../../modules/user/Entity.User';

@ObjectType({ isAbstract: true })
export abstract class CoreEntity {
	@Field(() => ID)
	@PrimaryGeneratedColumn('uuid')
	readonly id: string;

	@Field()
	@VersionColumn()
	version: number;

	@Field()
	@CreateDateColumn({ type: 'timestamp with time zone', update: false })
	readonly createdDate: Date;

	@Field({ nullable: true })
	@Column({ type: 'timestamp with time zone', nullable: true })
	updatedDate?: Date;

	@Field({ nullable: true })
	@DeleteDateColumn({ type: 'timestamp with time zone' })
	deletedDate?: Date;
}

@ObjectType({ isAbstract: true })
export abstract class CoreEntityWithUser extends CoreEntity {
	@Field(() => User)
	@ManyToOne(() => User)
	createdBy: Promise<User>;
	@Column({ type: 'uuid', update: false })
	readonly createdById: string;

	@Field(() => User, { nullable: true })
	@ManyToOne(() => User, { nullable: true })
	updatedBy: Promise<User>;
	@Column({ type: 'uuid', nullable: true })
	updatedById?: string;

	@Field(() => User, { nullable: true })
	@ManyToOne(() => User, { nullable: true })
	deletedBy: Promise<User>;
	@Column({ type: 'uuid', nullable: true })
	deletedById?: string;
}
