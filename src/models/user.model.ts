import { modelOptions, prop, getModelForClass } from '@typegoose/typegoose';

@modelOptions({ schemaOptions: { timestamps: true } })
export class User {
  @prop({ required: true, type: String })
  public firstName!: string;

  @prop({ required: true, type: String })
  public lastName!: string;

  @prop({ required: true, unique: true, type: String })
  public email!: string;

  @prop({ required: true, type: String })
  public password!: string;

  @prop({ type: Date, default: Date.now })
  public createdAt!: Date;
}

export const UserModel = getModelForClass(User);
