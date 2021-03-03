import { Field, ID, ObjectType } from 'type-graphql';
import { Column, CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, VersionColumn } from 'typeorm';

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

	@Column({ type: 'uuid', update: false })
	readonly createdById: string;

	@Column({ type: 'uuid', nullable: true })
	updatedById?: string;

	@Column({ type: 'uuid', nullable: true })
	deletedById?: string;
}
