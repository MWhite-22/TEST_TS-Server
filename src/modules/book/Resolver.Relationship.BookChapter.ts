import { FieldResolver, Resolver, ResolverInterface, Root } from 'type-graphql';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Book } from './Entity.Book';
import { BookChapter } from './Entity.BookChapter';

@Resolver(() => BookChapter)
export class BookChapterRelationshipResolver implements ResolverInterface<BookChapter> {
	@InjectRepository(Book)
	bookRepo: Repository<Book>;

	@FieldResolver(() => Book)
	async book(@Root() root: BookChapter): Promise<Book> {
		return this.bookRepo.findOneOrFail(root.bookId);
	}
}
