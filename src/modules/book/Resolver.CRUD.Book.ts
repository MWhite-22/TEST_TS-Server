import { Resolver } from 'type-graphql';
import { createCrudResolvers } from '../../utils/_core/createCrudResolvers';
import { Book } from './Entity.Book';
import { BookInputCreate, BookInputUpdate } from './Input.Book';

@Resolver(() => Book)
export class BookCrudResolvers extends createCrudResolvers(Book, BookInputCreate, BookInputUpdate) {}
