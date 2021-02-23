import { Field, InputType } from 'type-graphql';
import { GQLInputTypes } from '../../@types/utils';
import { User } from './Entity.User';

@InputType()
export class UserInputCreate implements GQLInputTypes<User> {
	@Field()
	name_first: string;

	@Field()
	name_last: string;

	@Field()
	email: string;

	@Field()
	password: string;
}

@InputType()
export class UserInputUpdate implements Partial<UserInputCreate> {
	@Field({ nullable: true })
	name_first?: string;

	@Field({ nullable: true })
	name_last?: string;

	@Field({ nullable: true })
	email?: string;
}
