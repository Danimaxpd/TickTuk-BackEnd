import { FilterQuery, UpdateQuery } from 'mongoose';
import { ModelType, DocType } from '../types/model.types';

export abstract class BaseRepository<T> {
  constructor(protected readonly model: ModelType<T>) {}

  public async create(data: Partial<T>): Promise<DocType<T>> {
    const entity = await this.model.create(data);
    return entity as DocType<T>;
  }

  public async findById(id: string): Promise<DocType<T> | null> {
    return await this.model.findById(id);
  }

  public async findOne(filter: FilterQuery<T>): Promise<DocType<T> | null> {
    return await this.model.findOne(filter);
  }

  public async find(filter: FilterQuery<T>): Promise<DocType<T>[]> {
    return await this.model.find(filter);
  }

  public async update(
    id: string,
    data: UpdateQuery<T>
  ): Promise<DocType<T> | null> {
    return await this.model.findByIdAndUpdate(id, data, { new: true });
  }

  public async delete(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id);
    return result !== null;
  }
}
