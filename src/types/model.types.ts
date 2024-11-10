import { DocumentType, ReturnModelType } from '@typegoose/typegoose';
import { BeAnObject } from '@typegoose/typegoose/lib/types';

export type ModelType<T> = ReturnModelType<new () => T, BeAnObject>;
export type DocType<T> = DocumentType<T>; 