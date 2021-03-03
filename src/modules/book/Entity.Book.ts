import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, OneToMany } from 'typeorm';
import { CoreEntity } from '../../utils/_core/Entity.Core';
import { BookChapter } from '../bookChapter/Entity.BookChapter';

@Entity()
@ObjectType()
export class Book extends CoreEntity {
	@Field()
	@Column({ unique: true })
	title: string;

	@Field()
	@Column()
	description: string;

	@Field()
	@Column()
	price: number;

	//DEV: REMOVE FIELD
	@Field(() => [BookChapter])
	@OneToMany(() => BookChapter, (bc) => bc.book)
	chapters: Promise<BookChapter[]>;
}
