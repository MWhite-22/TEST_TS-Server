import { AuthenticationError } from 'apollo-server-express';
import { createParamDecorator } from 'type-graphql';
import { Context, ISessionData } from '../@types/context';
import { ERROR_NOT_AUTHENTICATED } from '../constants';

export function SessionData() {
	return createParamDecorator<Context>(
		({ context }): ISessionData => {
			if (context.session.data?.currentUser.id) {
				return context.session.data;
			}
			throw new AuthenticationError(ERROR_NOT_AUTHENTICATED);
		}
	);
}
