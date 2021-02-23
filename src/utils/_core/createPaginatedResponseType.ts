import { ClassType, Field, ObjectType, Int } from 'type-graphql';

export function createPaginatedResponse<TItemsFieldValue>(
	itemsFieldValue: ClassType<TItemsFieldValue> | String | Number | Boolean
) {
	// `isAbstract` decorator option is mandatory to prevent registering in schema
	@ObjectType({ isAbstract: true })
	abstract class DefaultPaginatedResponse {
		@Field(() => [itemsFieldValue])
		items: TItemsFieldValue[];

		@Field(() => Int)
		total: number;

		@Field()
		hasMore: boolean;
	}
	return DefaultPaginatedResponse;
}
