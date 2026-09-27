import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Collections } from '../../../common/database/collections';

export type AiOrderSettingsDocument = HydratedDocument<AiOrderSettings>;

@Schema({ timestamps: true, collection: Collections.AI_ORDER_SETTINGS })
export class AiOrderSettings {
  @Prop({ required: true, unique: true, default: 'default' }) key: string;
  @Prop({ required: true, default: 'OpenAI key' }) name: string;
  @Prop({ required: true, default: 'gpt-6-luna' }) aiModel: string;
  @Prop({ required: true, default: 0.1 }) inputPricePerMillion: number;
  @Prop({ required: true, default: 0.01 }) cachedInputPricePerMillion: number;
  @Prop({ required: true, default: 0.5 }) outputPricePerMillion: number;
  @Prop({ type: String, default: null, select: false }) apiKeyEncrypted: string | null;
  @Prop({ type: String, default: null }) keyLastFour: string | null;
  @Prop({ required: true, default: true }) enabled: boolean;
  @Prop({ required: true, default: false, index: true }) isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const AiOrderSettingsSchema = SchemaFactory.createForClass(AiOrderSettings);
