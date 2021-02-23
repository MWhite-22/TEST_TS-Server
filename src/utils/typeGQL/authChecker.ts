import { AuthChecker } from 'type-graphql';
import { Context } from '../../@types/context';

export const authChecker: AuthChecker<Context> = async ({ context: { session } }, authorizedRoles) => {
	const currentUser = session.data?.currentUser;

	console.log(
		'\nAUTH_CHECK:',
		{
			'Current User': currentUser ? currentUser.email : 'Guest',
			'Authorized Roles Required': authorizedRoles,
		},
		'\n'
	);
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

	//DEV: Remove Me
	if (authorizedRoles.includes('UNAUTHED')) {
		return false;
	}
	//~~~ ^ REMOVE ^ ~~~//

	// Check that permissions overlap
	return authorizedRoles.some((role: string) => {
		if (role === 'REMOVE AFTER DEV') throw 'RemoveMe'; //DEV: Remove Me
		return true;

		// currentUser.accessRoles.includes(role)
	});
};
