import { Field, InputType } from 'type-graphql';
import { GQLInputTypes } from '../../@types/utils';
import { Book } from './Entity.Book';

@InputType()
export class BookInputCreate implements GQLInputTypes<Book> {
	@Field()
	title: string;

	@Field()
	description: string;

	@Field()
	price: number;
}

@InputType()
export class BookInputUpdate implements Partial<BookInputCreate> {
	@Field({ nullable: true })
	title?: string;

	@Field({ nullable: true })
	description?: string;

	@Field({ nullable: true })
	price?: number;
}
