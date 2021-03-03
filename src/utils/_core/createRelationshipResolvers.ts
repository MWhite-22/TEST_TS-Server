import { ClassType, Ctx, FieldResolver, Resolver, Root } from 'type-graphql';
import { Context } from '../../@types/context';
import { User } from '../../modules/user/Entity.User';
import { CoreEntity } from './Entity.Core';

export function createRelationshipResolvers<T extends ClassType & Partial<CoreEntity>>(entityType: T) {
	const entityName = entityType.name.toLocaleLowerCase();

	const TestEntity = new entityType();

	if (!(TestEntity instanceof CoreEntity)) {
		throw new Error(`Entity of type ${entityName} must extend the CoreEntity type`);
	}

	@Resolver(() => entityType, { isAbstract: true })
	abstract class baseResolvers {
		@FieldResolver(() => User)
		async createdBy(@Root() root: T, @Ctx() { entityLoaders }: Context): Promise<User> {
			return (await entityLoaders.User.load(root.createdById!)) as User; //DEV: Work around for entityLoader types
		}
		@FieldResolver(() => User, { nullable: true })
		async updatedBy(@Root() root: T, @Ctx() { entityLoaders }: Context): Promise<User | null> {
			return root.updatedById ? ((await entityLoaders.User.load(root.updatedById)) as User) : null; //DEV: Work around for entityLoader types
		}
		@FieldResolver(() => User, { nullable: true })
		async deletedBy(@Root() root: T, @Ctx() { entityLoaders }: Context): Promise<User | null> {
			return root.deletedById ? ((await entityLoaders.User.load(root.deletedById)) as User) : null; //DEV: Work around for entityLoader types
		}
	}
	return baseResolvers;
}
