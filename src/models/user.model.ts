import { modelOptions, prop, getModelForClass } from '@typegoose/typegoose';

@modelOptions({
  schemaOptions: {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        // Convert _id to id
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  },
})
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
