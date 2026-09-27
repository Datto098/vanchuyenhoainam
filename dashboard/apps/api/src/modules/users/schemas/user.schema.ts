import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserRole } from '@auto-tags/shared-types';
import { HydratedDocument } from 'mongoose';
import { Collections } from '../../../common/database/collections';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true, collection: Collections.USERS })
export class User {
  @Prop({ type: String, required: true, unique: true, lowercase: true, trim: true }) email: string;
  @Prop({ type: String, required: true, select: false }) passwordHash: string;
  @Prop({ type: String, required: true, trim: true }) fullName: string;
  @Prop({ type: String, enum: Object.values(UserRole), default: UserRole.OPERATOR }) role: string;
  @Prop({ type: String, enum: ['active', 'disabled'], default: 'active' }) status: string;
  @Prop({ type: String, default: null, select: false }) refreshTokenHash: string | null;
  @Prop({ type: Date, default: null }) lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
