import { Field, ID, ObjectType } from 'type-graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import { CoreEntityWithUser } from '../../utils/_core/Entity.Core';
import { Book } from './Entity.Book';

@Entity()
@ObjectType()
export class BookChapter extends CoreEntityWithUser {
	@Field({ nullable: true })
	@Column({ nullable: true })
	title: string;

	@Field()
	@Column()
	number: number;

	@Field()
	@Column()
	page_start: number;

	@Field(() => ID)
	@Column()
	bookId: string;
	@ManyToOne(() => Book, (b) => b.chapters)
	book: Promise<Book>;
}
