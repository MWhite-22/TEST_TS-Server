import { Query, Resolver } from 'type-graphql';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { User } from './Entity.User';
import { ISessionData } from '../../@types/context';
import { SessionData } from '../../utils/@SessionData';

@Resolver(() => User)
export class MeResolver {
	// ============================================================
	// 			REPOSITORY INSTANTIATION
	// ============================================================
	@InjectRepository(User)
	private readonly userRepo: Repository<User>;

	// ========================================
	// 			ME
	// ========================================
	@Query(() => User, { nullable: true })
	async auth_me(@SessionData() { currentUser }: ISessionData): Promise<User | undefined> {
		return await this.userRepo.findOne(currentUser.id);
	}
}
