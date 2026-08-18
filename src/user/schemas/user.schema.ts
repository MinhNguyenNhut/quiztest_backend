import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export enum UserRole {
  ADMIN = 'admin',
  OWNER = 'owner',
}

export type UserDocument = User & Document;

@Schema({ collection: 'users', timestamps: true })
export class User {
  @Prop({ trim: true })
  name?: string;

  @ApiProperty()
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email!: string;

  @ApiProperty()
  @Prop({ required: true })
  passwordHash!: string;

  @ApiProperty({ enum: UserRole })
  @Prop({ required: true, enum: Object.values(UserRole), default: UserRole.OWNER })
  role!: UserRole;

  createdAt!: Date;
  updatedAt!: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ email: 1 }, { unique: true });

UserSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (_doc: any, ret: any) {
    ret.id = ret._id?.toString();
    delete ret._id;
    delete ret.passwordHash;
    return ret;
  },
});
