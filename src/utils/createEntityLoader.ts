import DataLoader from 'dataloader';
import { ClassType } from 'type-graphql';
import { getManager, In } from 'typeorm';
import { ExtractPrimitiveFieldNames } from '../@types/utils';
import { Book } from '../modules/book/Entity.Book';
import { BookChapter } from '../modules/bookChapter/Entity.BookChapter';
import { User } from '../modules/user/Entity.User';
import { CoreEntity } from './_core/Entity.Core';

interface entityMap {
	Book: Book;
	BookChapter: BookChapter;
	User: User;
}

export type createEntityLoaders = {
	[P in keyof entityMap]: DataLoader<string, entityMap[P], string> | DataLoader<string, entityMap[P][], string>;
};

const createLoader = <T extends CoreEntity>(entity: ClassType<T>) => {
	return new DataLoader<string, T>(async (ids) => {
		const entities = await getManager().findByIds(entity, ids as string[]);

		// const idToEntityMap: Record<string, T> = {};
		const idToEntityMap: Record<string, T> = {};
		entities.forEach((e: any) => {
			idToEntityMap[e.id] = e;
		});

		return ids.map((id) => idToEntityMap[id]);
	});
};
const createArrayLoader = <T extends CoreEntity>(entity: ClassType<T>, where?: ExtractPrimitiveFieldNames<T>) => {
	const formattedWhere = where === undefined ? 'id' : where;

	// return new DataLoader<string, T>(async (ids) => {
	return new DataLoader<string, T[]>(async (ids) => {
		const entities = await getManager().find(entity, { where: { [`${formattedWhere}`]: In(ids as string[]) } });

		const idToEntityMap: any = {};
		entities.forEach((e: any) => {
			const mapIndex = e[`${formattedWhere}`];
			if (idToEntityMap[mapIndex] === undefined) {
				idToEntityMap[mapIndex] = [e];
			} else {
				idToEntityMap[mapIndex] = [...idToEntityMap[mapIndex], e];
			}
		});

		return ids.map((id) => idToEntityMap[id] || []);
	});
};

export function createEntityLoaders(): createEntityLoaders {
	return {
		Book: createLoader(Book),
		BookChapter: createArrayLoader(BookChapter, 'bookId'),
		User: createLoader(User),
	};
}
