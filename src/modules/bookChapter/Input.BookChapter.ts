import { Field, ID, InputType } from 'type-graphql';
import { GQLInputTypes } from '../../@types/utils';
import { BookChapter } from './Entity.BookChapter';

@InputType()
export class BookChapterInputCreate implements GQLInputTypes<BookChapter> {
	@Field()
	title: string;

	@Field()
	number: number;

	@Field(() => ID)
	bookId: string;
}

@InputType()
export class BookChapterInputUpdate implements Partial<BookChapterInputCreate> {
	@Field({ nullable: true })
	title?: string;

	@Field({ nullable: true })
	number?: number;

	@Field(() => ID, { nullable: true })
	bookId?: string;
}
