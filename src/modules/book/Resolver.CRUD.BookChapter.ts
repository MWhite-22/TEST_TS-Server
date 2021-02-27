import { Resolver } from 'type-graphql';
import { createCrudResolvers } from '../../utils/_core/createCrudResolvers';
import { BookChapter } from './Entity.BookChapter';
import { BookChapterInputCreate, BookChapterInputUpdate } from './Input.BookChapter';

@Resolver(() => BookChapter)
export class BookChapterCrudResolvers extends createCrudResolvers(
	BookChapter,
	BookChapterInputCreate,
	BookChapterInputUpdate
) {}
