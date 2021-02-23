import { Arg, Ctx, Resolver } from 'type-graphql';
import { Query } from 'type-graphql';
import { Inject } from 'typedi';
import { Context, ISessionData } from '../../@types/context';
import { Logger } from '../../utils/Logger';
import { SessionData } from '../../utils/typeGQL/@SessionData';
import { wait } from '../../utils/wait';

@Resolver()
export class SystemResolver {
	@Inject()
	private readonly logger: Logger;

	@Query(() => String)
	hello(@Ctx() { requestId }: Context): string {
		return `[${requestId}] - Hello World`;
	}

	@Query(() => String)
	async testLogger(@Arg('string') test: string, @Ctx() { requestId }: Context): Promise<string> {
		await wait(5000);
		this.logger.log(test);
		return `[${requestId}] - ${test}`;
	}

	@Query(() => Object)
	async getSessionData(@SessionData() sessionData: ISessionData): Promise<ISessionData> {
		return sessionData;
	}
}
