import type { Session } from 'express-session';
import { Redis } from 'ioredis';
import { User } from '../modules/user/Entity.User';
import { createEntityLoaders } from '../utils/createEntityLoader';

export interface ISessionData {
	currentUser: {
		id: User['id'];
		email: User['email'];
	};
}

export interface Context {
	req: Express.Request;
	res: Express.Response;
	session: Session & { data?: ISessionData };
	redis: Redis;
	requestId: string;
	entityLoaders: createEntityLoaders;
}
