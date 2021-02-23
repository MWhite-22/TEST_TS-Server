import { ApolloServer } from 'apollo-server-express';
import ConnectRedis from 'connect-redis';
import cors from 'cors';
import type { Express } from 'express';
import express from 'express';
import session from 'express-session';
import { GraphQLSchema } from 'graphql';
import { join } from 'path';
import { buildSchema } from 'type-graphql';
import { Container } from 'typedi';
import { Connection, getConnectionManager, useContainer as TypeORMContainer } from 'typeorm';
import { Context } from './@types/context';
import { FRONTEND_URL, PORT, REDIS_PREFIX_COOKIE_SESSION, SESSION_ID, SESSION_SECRET, __PROD__ } from './constants';
import { RedisClient } from './database/config/redisConfig';
import { getDbConnectionOptions } from './database/config/typeormConfig';
import { authChecker } from './utils/typeGQL/authChecker';
import { RequestTimerPlugin } from './utils/apollo/plugins/ResponseTimer';
import { GraphQLJSON } from './utils/typeGQL/scalars/JSONScalar';

export class Server {
	public OrmConnection: Connection;
	public GqlSchema: GraphQLSchema;
	public ApolloServer: ApolloServer;
	public app: Express;

	constructor() {
		this.app = express();
		TypeORMContainer(Container);
	}

	// ============================================================
	// 			SETUP EXPRESS APP
	// ============================================================
	public createExpressApp() {
		this.app.set('trust proxy', 1);
		this.app.use(cors({ credentials: true, origin: FRONTEND_URL }));
	}

	// ============================================================
	// 			INSTANTIATE REDIS CONNECTION AND SESSIONS
	// ============================================================
	public setupSessions() {
		const RedisStore = ConnectRedis(session);
		this.app.use(
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
	}

	// ============================================================
	// 			CONNECT TYPEORM TO DATABASE
	// ============================================================
	public async connectDB() {
		this.OrmConnection = getConnectionManager().create(getDbConnectionOptions());

		try {
			await this.OrmConnection.connect();
			console.log('TypeORM Connected:', this.OrmConnection.isConnected);
		} catch (e) {
			console.warn('TypeORM Connection Error');
			console.log(e);
			process.exit(1);
		}
	}

	// ============================================================
	// 			GENERATE GRAPHQL SCHEMA
	// ============================================================
	public async generateGQLSchema() {
		this.GqlSchema = await buildSchema({
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
	}

	// ============================================================
	// 			GENERATE THE GRAPHQL SERVER
	// ============================================================
	public async generateApolloServer() {
		this.ApolloServer = new ApolloServer({
			schema: this.GqlSchema,
			context: ({ req, res }): Context => {
				const requestId = String(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER));
				return { req, res, session: req.session, redis: RedisClient, requestId };
			},
			plugins: [RequestTimerPlugin],
			playground: __PROD__
				? false
				: {
						settings: {
							'request.credentials': 'include',
						},
				  },
		});
	}

	// ============================================================
	// 			INITIALIZE SERVER
	// ============================================================
	public async init() {
		this.createExpressApp();
		this.setupSessions();
		await this.connectDB();
		await this.generateGQLSchema();
		await this.generateApolloServer();
		this.ApolloServer.applyMiddleware({ app: this.app, cors: false });
	}

	// ============================================================
	// 			START THE SERVER
	// ============================================================
	public async start() {
		await this.init();
		this.app.listen(PORT, () => {
			console.log('🚀 Server is running');
			if (!__PROD__) {
				console.log(
					`🚀 GraphQL Playground available at http://localhost:${PORT}${this.ApolloServer.graphqlPath}`
				);
			}
		});
	}
}
