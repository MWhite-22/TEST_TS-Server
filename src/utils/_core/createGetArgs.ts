import { Min } from 'class-validator';
import { ArgsType, Field } from 'type-graphql';

// ============================================================
// 			DEFAULT PAGINATION ARGS
// ============================================================
@ArgsType()
export class PaginationArgs {
	@Field({
		description: 'Limit the number of records returned. Defaults to 50',
		nullable: true,
	})
	@Min(1)
	limit?: number = 50;

	@Field({ description: 'Skip the first X values', nullable: true })
	@Min(0)
	offset?: number = 0;
}

type WherePropertyNames<T> = {
	[K in keyof T]: T[K] extends Function | Promise<any> ? never : K;
}[keyof T];

export type WhereProperties<T> = Pick<T, WherePropertyNames<T>>;

// ============================================================
// 			TRYING TO PROGRAMATICALLY CREATE WHERE TYPES
// ============================================================
// https://stackoverflow.com/questions/59217826/how-can-i-programmatically-create-class-functions-in-typescript

// type whereClauses = 'eq' | 'includes' | 'not';
// type whereArgs<T> = { [P in WherePropertyNames<T>]?: { [k in whereClauses]?: T[P] } };
// type orderByArgs<T> = { [P in WherePropertyNames<T>]?: 'ASC' | 'DESC' };

// export function createGetArgs<T extends ClassType>() {
// 	// const createWhereObject: whereArgs<User> = () => {
// 	// 	let result = {};
// 	// 	const entries = Object.entries(User).map(([key, value]) => {});
// 	// 	return result;
// 	// };

// 	// orderBy?: { [P in keyof T as `${Uppercase<P & string>}_${'ASC' | 'DESC'}`]?: boolean };

// 	@ArgsType()
// 	abstract class baseGetArgs {
// 		@Field({
// 			description: 'Limit the number of records returned. Defaults to 50',
// 			nullable: true,
// 		})
// 		@Min(1)
// 		limit?: number = 50;

// 		@Field({
// 			description: 'Skip the first X values. Defaults to 0',
// 			nullable: true,
// 		})
// 		@Min(0)
// 		offset?: number = 0;

// 		@Field(() => Object, {
// 			description: 'Filter the number of records returned',
// 			nullable: true,
// 		})
// 		where?: whereArgs | whereArgs[];

// 		@Field(() => Object, {
// 			description: 'Determine the order of records returned',
// 			nullable: true,
// 		})
// 		orderBy?: orderByArgs;

// FROM OTHER TESTS
// @Field(() => Object, { nullable: true })
// where?: whereArgs<T>;

// @Field(() => Object, { nullable: true })
// orderBy?: orderByArgs<T>;

// 	}
// 	return baseGetArgs;
// }
