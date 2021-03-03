import { Field, ID, ObjectType } from 'type-graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import { CoreEntity } from '../../utils/_core/Entity.Core';
import { Book } from '../book/Entity.Book';

@Entity()
@ObjectType()
export class BookChapter extends CoreEntity {
	@Field({ nullable: true })
	@Column({ nullable: true })
	title: string;

	@Field()
	@Column()
	number: number;

	//DEV: REMOVE FIELD
	@Field(() => ID)
	@Column()
	bookId: string;

	//DEV: REMOVE FIELD
	@Field(() => Book)
	@ManyToOne(() => Book, (b) => b.chapters)
	book: Promise<Book>;
}
