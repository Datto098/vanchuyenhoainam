import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Collections } from '../../../common/database/collections';

export type AiOrderUsageDocument = HydratedDocument<AiOrderUsage>;

@Schema({ timestamps: true, collection: Collections.AI_ORDER_USAGES })
export class AiOrderUsage {
  @Prop({ type: Types.ObjectId, required: true, index: true }) taskId: Types.ObjectId;
  @Prop({ required: true }) aiModel: string;
  @Prop({ default: 0 }) inputTokens: number;
  @Prop({ default: 0 }) cachedInputTokens: number;
  @Prop({ default: 0 }) outputTokens: number;
  @Prop({ default: 0 }) costUsd: number;
  @Prop({ default: 0 }) latencyMs: number;
  @Prop({ type: String, default: null }) providerRequestId: string | null;
  createdAt: Date;
}

export const AiOrderUsageSchema = SchemaFactory.createForClass(AiOrderUsage);
