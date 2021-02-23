import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { User } from './Entity.User';
import { ERROR_INVALID_LOGIN, REDIS_PREFIX_USER_SESSION_LIST } from '../../constants';
import { Context } from '../../@types/context';

@Resolver(() => User)
export class AuthLoginResolver {
	// ============================================================
	// 			REPOSITORY INSTANTIATION
	// ============================================================
	@InjectRepository(User)
	private readonly userRepo: Repository<User>;

	// ========================================
	// 			LOGIN
	// ========================================
	@Mutation(() => User)
	async auth_login(
		@Arg('email') email: string,
		@Arg('password') password: string,
		@Ctx() { req, redis, session }: Context
	): Promise<User> {
		const foundUser = await this.userRepo.findOne({
			where: { email },
		});

		if (!foundUser) {
			throw new Error(ERROR_INVALID_LOGIN);
		}

		//Verify password
		const validPw = foundUser.password === password;
		if (!validPw) {
			throw new Error(ERROR_INVALID_LOGIN);
		}

		//Login details have been found. Check authentication credentials
		// const validPW = await argon2.verify(foundUserLoginDetails.password, password);
		// if (!validPW) {
		// 	// If password attempt was invalid, add a count to incorrect login attempts, and set the expiration to 24 hours
		// 	const wrongAttempts = await redis.incr(`${REDIS_PREFIX_WRONG_PASSWORD}${foundUserLoginDetails.userId}`);
		// 	await redis.pexpireat(
		// 		`${REDIS_PREFIX_WRONG_PASSWORD}${foundUserLoginDetails.userId}`,
		// 		new Date().setUTCHours(24, 0, 0, 0)
		// 	);
		// 	//On the 10th wrong attempt, lock the userLogin, and send an email confirming the account has been locked
		// 	if (wrongAttempts === 10) {
		// 		foundUserLoginDetails.isLocked = true;
		// 		this.loginRepo.save(foundUserLoginDetails);
		// 		console.log(
		// 			`LOCK USER ACCOUNT: ${foundUserLoginDetails.user.name_full} - ${foundUserLoginDetails.email_personal} `
		// 		);
		// 		sendAccountLockEmail(foundUserLoginDetails.email_personal);
		// 	}
		// 	throw new Error(ERROR_INVALID_LOGIN);
		// }

		//Reset wrong password count. No need to wait
		// redis.del(`${REDIS_PREFIX_WRONG_PASSWORD}${foundUserLoginDetails.userId}`);

		// If the password was correct, confirm the accout isnt locked
		// if (foundUserLoginDetails.isLocked) throw new Error(ERROR_ACCOUNT_LOCKED);

		// If the email hasn't been confirmed yet, make the user confirm their email
		// if (!foundUserLoginDetails.isEmailConfirmed) throw new Error(ERROR_EMAIL_UNCONFIRMED);

		//If no activeCompanyProfile has been found yet, grab the default profile from the user's account. If no default, grab the first one
		// if (!activeCompanyProfile) {
		// 	const allCompanyProfiles = await this.userCompanyLinkRepo.find({
		// 		where: { userId: foundUserLoginDetails.userId },
		// 	});

		// 	activeCompanyProfile =
		// 		allCompanyProfiles.find((profile) => profile.defaultProfile) || allCompanyProfiles[0];
		// }

		//Set session data
		session.data = {
			currentUser: {
				id: foundUser.id,
				email: foundUser.email,
			},
		};

		//Add the session ID to a list of active sessions for the found user
		await redis.sadd(`${REDIS_PREFIX_USER_SESSION_LIST}${foundUser.id}`, req.sessionID);

		//Return the LoginResponse Data
		return foundUser;
	}
}
