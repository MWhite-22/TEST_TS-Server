import { Authorized, FieldResolver, Resolver } from 'type-graphql';
import { createCrudResolvers } from '../../utils/_core/createCrudResolvers';
import { User } from './Entity.User';
import { UserInputCreate, UserInputUpdate } from './Input.User';

@Resolver(() => User)
export class UserResolver extends createCrudResolvers(User, UserInputCreate, UserInputUpdate) {
	@Authorized('UNAUTHED')
	@FieldResolver({ nullable: true })
	unauthed(): string {
		return 'Field Resolver';
	}
}
