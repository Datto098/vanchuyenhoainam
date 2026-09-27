import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Collections } from '../../../common/database/collections';

export type AiOrderRateLimitDocument = HydratedDocument<AiOrderRateLimit>;

@Schema({ timestamps: true, collection: Collections.AI_ORDER_RATE_LIMITS })
export class AiOrderRateLimit {
  @Prop({ required: true, unique: true, index: true }) key: string;
  @Prop({ required: true, default: 0 }) count: number;
  @Prop({ type: Date, required: true }) expiresAt: Date;
}

export const AiOrderRateLimitSchema = SchemaFactory.createForClass(AiOrderRateLimit);
AiOrderRateLimitSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
