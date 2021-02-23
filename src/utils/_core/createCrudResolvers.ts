import { Arg, Args, Authorized, ClassType, ID, Mutation, ObjectType, Query, Resolver } from 'type-graphql';
import { DeepPartial, Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { ISessionData } from '../../@types/context';
import { SessionData } from '../@SessionData';
import { createPaginatedResponse } from './createPaginatedResponseType';
import { CoreEntity } from './Entity.Core';
import { DefaultGetArgs } from './createGetArgs';
import { capitalize } from '../capitalize';

export function createCrudResolvers<T extends ClassType & Partial<CoreEntity>>(
	entityType: T,
	createEntityInput: DeepPartial<T>,
	updateEntityInput: DeepPartial<T>
) {
	const entityName = entityType.name.toLocaleLowerCase();

	const TestEntity = new entityType();

	if (!(TestEntity instanceof CoreEntity)) {
		throw new Error(`Entity of type ${entityName} must extend the CoreEntity type`);
	}

	@ObjectType(`${capitalize(entityName)}DefaultPaginatedResponse`)
	class basePaginatedResponse extends createPaginatedResponse(entityType) {}

	@Resolver(() => entityType, { isAbstract: true })
	abstract class baseResolvers {
		// ============================================================
		// 			INJECT REPOSITORY
		// ============================================================
		@InjectRepository(entityType)
		protected readonly baseRepo: Repository<T>;

		// ============================================================
		// 			GET ONE
		// ============================================================
		@Query(() => entityType, {
			name: `${entityName}_getOne`,
			description: `Returns a single ${entityName} object`,
			nullable: true,
		})
		@Authorized(`${entityName.toUpperCase()}:READ`)
		async getOne(
			@Arg(`${entityName}Id`, () => ID) entityId: string,
			@Arg('includeDeleted', {
				description: 'Include soft-deleted entities in the return results',
				nullable: true,
			})
			withDeleted: boolean = false
		): Promise<T | undefined> {
			return await this.baseRepo.findOne({
				where: { id: entityId },
				withDeleted,
			});
		}

		// ============================================================
		// 			GET MANY
		// ============================================================
		@Query(() => basePaginatedResponse, {
			name: `${entityName}_getMany`,
			description: `Returns all ${entityName} objects`,
		})
		@Authorized(`${entityName.toUpperCase()}:READ`)
		async getMany(
			@Args() { limit, offset, where }: DefaultGetArgs<T>,
			@Arg('includeDeleted', {
				description: 'Include soft-deleted entities in the return results',
				nullable: true,
			})
			withDeleted: boolean = false
		): Promise<basePaginatedResponse> {
			console.log('WHERE ARGS: ', { where });

			const [results, count] = await this.baseRepo.findAndCount({
				take: limit,
				skip: offset,
				withDeleted,
			});

			return {
				items: results,
				total: count,
				hasMore: results.length < count,
			};
		}

		// ============================================================
		// 			CREATE ONE
		// ============================================================
		@Mutation(() => entityType, {
			name: `${entityName}_create`,
			description: `Create a new ${entityName} object`,
		})
		@Authorized(`${entityName.toUpperCase()}:CREATE`)
		async create(
			@Arg('input', () => createEntityInput) input: DeepPartial<T>,
			@SessionData() { currentUser }: ISessionData
		): Promise<T> {
			const newEntity = this.baseRepo.create({
				...input,
				// ...this.formatRelationFields(input),
				createdById: currentUser.id,
			});

			const formattedNewEntity: DeepPartial<T> = Object.assign({}, newEntity);

			return await this.baseRepo.save(formattedNewEntity);
		}

		// ============================================================
		// 			UPDATE ONE
		// ============================================================
		@Mutation(() => entityType, {
			name: `${entityName}_update`,
			description: `Update a single ${entityName} object with new Data`,
		})
		@Authorized(`${entityName.toUpperCase()}:UPDATE`, 'OWNER')
		async update(
			@Arg(`${entityName}Id`, () => ID) entityId: string,
			@Arg('input', () => updateEntityInput) input: DeepPartial<T>,
			@SessionData() { currentUser }: ISessionData
		): Promise<T> {
			const oldEntity = await this.baseRepo.findOne(entityId);
			if (!oldEntity) {
				throw new Error(`Invalid ${entityName}Id`);
			}

			const updateData = {
				...input,
				// ...this.formatRelationFields(input),
				updatedDate: new Date(),
				updatedById: currentUser.id,
			};

			const newEntity = this.baseRepo.create({
				...oldEntity,
				...updateData,
			});

			const formattedNewEntity: DeepPartial<T> = Object.assign({}, newEntity);

			return await this.baseRepo.save(formattedNewEntity);
		}

		// ============================================================
		// 			DELETE ONE
		// ============================================================
		@Mutation(() => entityType, {
			name: `${entityName}_delete`,
			description: `Soft-delete a single ${entityName} object in the database`,
		})
		@Authorized(`${entityName.toUpperCase()}:DELETE`, 'OWNER')
		async softDelete(
			@Arg(`${entityName}Id`, () => ID) entityId: string,
			@SessionData() { currentUser }: ISessionData
		): Promise<T> {
			const oldEntity = await this.baseRepo.findOne(entityId, {
				withDeleted: true,
			});
			if (!oldEntity) {
				throw new Error(`Invalid ${entityName}Id`);
			}

			if (oldEntity.deletedDate) {
				throw new Error(`${entityName}-${entityId} has already been deleted`);
			}

			const newEntity = this.baseRepo.create({
				...(oldEntity as DeepPartial<T>),
				deletedDate: new Date(),
				deletedById: currentUser.id,
			});

			return await this.baseRepo.save(newEntity as DeepPartial<T>);
		}
		// ============================================================
		// 			RESTORE ONE
		// ============================================================
		@Mutation(() => entityType, {
			name: `${entityName}_restore`,
			description: `Restore a single ${entityName} object in the database`,
		})
		@Authorized(`${entityName.toUpperCase()}:RESTORE`, 'OWNER', 'ADMIN')
		async restore(
			@Arg(`${entityName}Id`, () => ID) entityId: string,
			@SessionData() { currentUser }: ISessionData
		): Promise<T> {
			const oldEntity = await this.baseRepo.findOne(entityId, {
				withDeleted: true,
			});

			if (!oldEntity) {
				throw new Error(`Invalid ${entityName}Id`);
			}

			if (!oldEntity.deletedDate) {
				throw new Error(`${entityName}-${entityId} is currently active`);
			}

			const newEntity = this.baseRepo.create({
				...(oldEntity as DeepPartial<T>),
				updatedDate: new Date(),
				updatedById: currentUser.id,
				deletedDate: null,
				deletedById: null,
			});

			return await this.baseRepo.save(newEntity as DeepPartial<T>);
		}

		// ============================================================
		// 			HELPER METHODS
		// ============================================================
		// formatRelationFields(input: DeepPartial<T>): DeepPartial<T> {
		// 	return Object.keys(input).reduce((result: any, key: string) => {
		// 		if (!key.includes('Id')) {
		// 			return result;
		// 		}
		// 		const newKey = key.replace('Id', '');
		// 		result[newKey] = { id: (input as any)[key] };
		// 		return result;
		// 	}, {});
		// }
	}

	return baseResolvers;
}
