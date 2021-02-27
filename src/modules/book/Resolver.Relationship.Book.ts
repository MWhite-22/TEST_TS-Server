import { Args, FieldResolver, Resolver, ResolverInterface, Root } from 'type-graphql';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { DefaultGetArgs } from '../../utils/_core/createGetArgs';
import { Book } from './Entity.Book';
import { BookChapter } from './Entity.BookChapter';

@Resolver(() => Book)
export class BookRelationshipResolver implements ResolverInterface<Book> {
	@InjectRepository(BookChapter)
	bookChapterRepo: Repository<BookChapter>;

	@FieldResolver(() => [BookChapter])
	async chapters(@Root() root: Book, @Args() args: DefaultGetArgs<BookChapter>): Promise<BookChapter[]> {
		console.log({ args });
		return this.bookChapterRepo.find({ where: { bookId: root.id } });
	}
}
