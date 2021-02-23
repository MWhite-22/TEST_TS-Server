import 'dotenv-safe/config';
import { getConnectionManager } from 'typeorm';
import { v4 } from 'uuid';
import { __PROD__ } from '../../constants';
import { User } from '../../modules/user/Entity.User';
import { getDbConnectionOptions } from '../config/typeormConfig';

const TypeORM = getConnectionManager().create(getDbConnectionOptions(true));

const seedDB = async () => {
	await TypeORM.connect();
	if (TypeORM.isConnected) {
		await TypeORM.dropDatabase();
		await TypeORM.synchronize();
		const EM = TypeORM.createEntityManager();

		const AdminUserId = v4();

		const AdminUser = EM.create(User, {
			id: AdminUserId,
			name_first: 'Admin',
			name_last: 'Test',
			email: 'admin@test.com',
			password: 'password',
			createdById: AdminUserId,
		});

		await EM.save(User, AdminUser);
	}
};

seedDB()
	.catch((e) => console.error(e))
	.finally(() => {
		TypeORM.close();
		process.exit(0);
	});
