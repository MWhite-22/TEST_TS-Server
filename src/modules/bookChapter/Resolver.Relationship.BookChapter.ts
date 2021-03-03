import { Ctx, FieldResolver, Resolver, Root } from 'type-graphql';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Context } from '../../@types/context';
import { Book } from '../book/Entity.Book';
import { BookChapter } from './Entity.BookChapter';

@Resolver(() => BookChapter)
export class BookChapterRelationshipResolver {
	@InjectRepository(Book)
	bookRepo: Repository<Book>;

	@FieldResolver(() => Book)
	async bookLoader(@Root() root: BookChapter, @Ctx() { entityLoaders }: Context): Promise<Book> {
		return (await entityLoaders.Book.load(root.bookId)) as Book; //DEV: Work around for entityLoader Types
	}
}
