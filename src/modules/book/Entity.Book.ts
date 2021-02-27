import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, OneToMany } from 'typeorm';
import { CoreEntityWithUser } from '../../utils/_core/Entity.Core';
import { BookChapter } from './Entity.BookChapter';

@Entity()
@ObjectType()
export class Book extends CoreEntityWithUser {
	@Field()
	@Column({ unique: true })
	title: string;

	@Field()
	@Column()
	description: string;

	@Field()
	@Column()
	price: number;

	@OneToMany(() => BookChapter, (bc) => bc.book)
	chapters: Promise<BookChapter[]>;
}
