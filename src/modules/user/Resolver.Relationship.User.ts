import { Resolver } from 'type-graphql';
import { createRelationshipResolvers } from '../../utils/_core/createRelationshipResolvers';
import { User } from './Entity.User';

@Resolver(() => User)
export class UserRelationshipResolver extends createRelationshipResolvers(User) {}
