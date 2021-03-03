import 'reflect-metadata';
import 'dotenv-safe/config';
import { ApolloServer } from 'apollo-server-express';
import ConnectRedis from 'connect-redis';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import { join } from 'path';
import { buildSchema } from 'type-graphql';
import { Container } from 'typedi';
import { getConnectionManager, useContainer as TypeORMContainer } from 'typeorm';
import { Context } from './@types/context';
import { FRONTEND_URL, PORT, REDIS_PREFIX_COOKIE_SESSION, SESSION_ID, SESSION_SECRET, __PROD__ } from './constants';
import { RedisClient } from './database/config/redisConfig';
import { getDbConnectionOptions } from './database/config/typeormConfig';
import { authChecker } from './utils/typeGQL/authChecker';
import { RequestTimerPlugin } from './utils/apollo/plugins/ResponseTimer';
import { GraphQLJSON } from './utils/typeGQL/scalars/JSONScalar';
import { createEntityLoaders } from './utils/createEntityLoader';

TypeORMContainer(Container);

const startServer = async () => {
	// ============================================================
	// 			SETUP EXPRESS APP
	// ============================================================
	const app = express();
	app.set('trust proxy', 1);
	app.use(cors({ credentials: true, origin: FRONTEND_URL }));

	// ============================================================
	// 			INSTANTIATE REDIS CONNECTION AND SESSIONS
	// ============================================================

	const RedisStore = ConnectRedis(session);
	app.use(
		session({
			store: new RedisStore({
				client: RedisClient,
				prefix: REDIS_PREFIX_COOKIE_SESSION,
				disableTouch: true,
			}),
			name: SESSION_ID,
			secret: SESSION_SECRET,
			proxy: true,
			resave: false,
			saveUninitialized: false,
			cookie: {
				httpOnly: true,
				sameSite: 'lax',
				secure: __PROD__,
				maxAge: 1000 * 60 * 60 * 24 * 365, //1 YEAR
			},
		})
	);

	// ============================================================
	// 			CONNECT TYPEORM TO DATABASE
	// ============================================================
	const TypeOrm = getConnectionManager().create(getDbConnectionOptions());
	try {
		await TypeOrm.connect();
		console.log('TypeORM Connected:', TypeOrm.isConnected);
	} catch (e) {
		console.warn('TypeORM Connection Error');
		console.log(e);
		process.exit(1);
	}

	// ============================================================
	// 			GENERATE GRAPHQL SCHEMA
	// ============================================================

	const schema = await buildSchema({
		resolvers: [join(__dirname, './modules/**/Resolver.*js')],
		scalarsMap: [{ type: Object, scalar: GraphQLJSON }],
		emitSchemaFile: {
			path: './schema.gql',
			commentDescriptions: true,
			sortedSchema: true,
		},
		container: Container,
		authChecker,
	});

	// ============================================================
	// 			GENERATE THE GRAPHQL SERVER
	// ============================================================
	const apolloServer = new ApolloServer({
		schema,
		context: ({ req, res }): Context => {
			const requestId = String(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER));
			return {
				req,
				res,
				requestId,
				redis: RedisClient,
				session: req.session,
				entityLoaders: createEntityLoaders(),
			};
		},
		plugins: [RequestTimerPlugin],
		tracing: !__PROD__,
		playground: __PROD__
			? false
			: {
					settings: {
						'request.credentials': 'include',
					},
			  },
	});
	apolloServer.applyMiddleware({ app: app, cors: false });

	// ============================================================
	// 			START THE SERVER
	// ============================================================
	app.listen(PORT, () => {
		console.log('🚀 Server is running');
		if (!__PROD__) {
			console.log(`🚀 GraphQL Playground available at http://localhost:${PORT}${apolloServer.graphqlPath}`);
		}
	});
};

startServer().catch((err) => {
	console.error('[START SERVER - CATCH ERROR]', err);
});
