import { Args, Ctx, FieldResolver, Resolver, Root } from 'type-graphql';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Context } from '../../@types/context';
import { PaginationArgs } from '../../utils/_core/createGetArgs';
import { createRelationshipResolvers } from '../../utils/_core/createRelationshipResolvers';
import { BookChapter } from '../bookChapter/Entity.BookChapter';
import { Book } from './Entity.Book';

@Resolver(() => Book)
export class BookRelationshipResolver extends createRelationshipResolvers(Book) {
	@InjectRepository(BookChapter)
	bookChapterRepo: Repository<BookChapter>;

	@FieldResolver(() => [BookChapter])
	async chaptersLoader(
		@Root() root: Book,
		@Args() {}: PaginationArgs,
		@Ctx() { entityLoaders }: Context
	): Promise<BookChapter[]> {
		return (await entityLoaders.BookChapter.load(root.id)) as BookChapter[]; //DEV: Work around for entityLoader types
	}
}
