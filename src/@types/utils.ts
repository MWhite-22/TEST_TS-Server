import { CoreEntityWithUser } from '../utils/_core/Entity.Core';

export type ExtractPrimitiveFieldNames<T> = {
	[K in keyof T]: T[K] extends Function | Promise<any> ? never : K;
}[keyof T];

export type ExtractPrimitiveFields<T> = Pick<T, ExtractPrimitiveFieldNames<T>>;

export type GQLInputTypes<T> = Omit<ExtractPrimitiveFields<T>, keyof CoreEntityWithUser>;
