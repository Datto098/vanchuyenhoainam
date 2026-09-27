import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Collections } from '../../../common/database/collections';

export type AiOrderTaskDocument = HydratedDocument<AiOrderTask>;

@Schema({ timestamps: true, collection: Collections.AI_ORDER_TASKS })
export class AiOrderTask {
  @Prop({ required: true, unique: true, index: true }) clientRequestId: string;
  @Prop({ required: true, index: true }) userId: string;
  @Prop({ required: true, enum: ['1688', 'taobao', 'tmall'], index: true }) platform: string;
  @Prop({ required: true }) pageUrl: string;
  @Prop({ default: '' }) userNote: string;
  @Prop({ type: Object, required: true, select: false }) snapshot: Record<string, unknown>;
  @Prop({ required: true, default: 'queued', index: true }) status: string;
  @Prop({ required: true, default: 'queued' }) stage: string;
  @Prop({ required: true, default: 'Task đã được tiếp nhận' }) message: string;
  @Prop({ default: 0 }) attemptCount: number;
  @Prop({ type: Object, default: null }) extraction: Record<string, unknown> | null;
  @Prop({ type: Object, default: null }) orderResponse: Record<string, unknown> | null;
  @Prop({ type: String, default: null }) orderId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export const AiOrderTaskSchema = SchemaFactory.createForClass(AiOrderTask);
AiOrderTaskSchema.index({ status: 1, createdAt: -1 });
