import { join } from 'path';
import { ConnectionOptions } from 'typeorm';
import { DATABASE_URL, __PROD__ } from '../../constants';

export const getDbConnectionOptions = (seedDb = false): ConnectionOptions => {
	const allConnections: ConnectionOptions[] = [
		{
			name: 'development',
			type: 'postgres',
			host: '192.168.1.202',
			port: 5432,
			database: 'Test_TS-Server_DEV',
			username: 'admin',
			password: 'password',
			synchronize: true,
			logging: true,
			entities: [join(__dirname, '../../modules/**/Entity.*.js')],
			migrations: [join(__dirname, './migrations/**/*.js')],
			subscribers: [join(__dirname, './subscriber/**/*.js')],
			// cli: {
			// 	entitiesDir: 'src/modules',
			// 	migrationsDir: 'src/migration',
			// 	subscribersDir: 'src/subscriber',
			// },
		},
		{
			name: 'production',
			type: 'postgres',
			url: DATABASE_URL,
			synchronize: true, // switch this to false once you have the initial tables created and use migrations instead
			logging: false,
			entities: [join(__dirname, '../../modules/**/Entity.*.js')],
			migrations: [join(__dirname, './migrations/**/*.js')],
			subscribers: [join(__dirname, './subscriber/**/*.js')],
			// cli: {
			// 	entitiesDir: 'build/entity',
			// 	migrationsDir: 'build/migration',
			// 	subscribersDir: 'build/subscriber',
			// },
		},
	];

	let foundConnection = allConnections.find(
		(connection) => connection.name === (__PROD__ ? 'production' : 'development')
	);

	if (!foundConnection) foundConnection = allConnections[0];

	return { ...foundConnection, name: 'default', ...(seedDb ? { synchronize: false } : {}) };
};
