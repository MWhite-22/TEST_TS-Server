import { AuthChecker } from 'type-graphql';
import { Context } from '../../@types/context';

export const authChecker: AuthChecker<Context> = async ({ context: { session } }, authorizedRoles) => {
	const currentUser = session.data?.currentUser;

	console.log('\n~~~~~~~~~~ AUTH CHECK ~~~~~~~~~~');
	console.log('Current User: ', currentUser ? currentUser.email : 'Guest');
	console.log('Authorized Roles Required: ', authorizedRoles);
	// console.log('Accessed Object: ', root);

	// Confirm there is a logged in user
	if (!currentUser) return false;

	// Checking empty @Authorized() - return true since we know there is a user now
	if (authorizedRoles.length === 0) {
		return true;
	}

	// If 'ADMIN' is an authorized role, check that user has admin privledges
	if (authorizedRoles.includes('ADMIN')) {
		// return currentUser.isAdmin;
	}

	//DEV
	if (authorizedRoles.includes('UNAUTHED')) {
		return false;
	}

	// Check that permissions overlap
	return authorizedRoles.some((role: string) => {
		// currentUser.accessRoles.includes(role)
		console.log('Role', role);
		return true;
	});
};
