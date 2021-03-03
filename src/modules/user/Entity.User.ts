import { Field, ObjectType, Root } from 'type-graphql';
import { Column, Entity } from 'typeorm';
import { CoreEntity } from '../../utils/_core/Entity.Core';

@Entity()
@ObjectType()
export class User extends CoreEntity {
	@Field()
	@Column()
	name_first: string;

	@Field()
	@Column()
	name_last: string;

	@Field()
	@Column({ unique: true })
	email: string;

	@Column()
	password: string;

	@Field()
	name_full(@Root() root: User): string {
		return `${root.name_first} ${root.name_last}`;
	}
}
