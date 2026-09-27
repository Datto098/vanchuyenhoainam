import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ _id: false })
export class OperationalError {
  @Prop({ type: String, required: true })
  code: string;

  @Prop({ type: String, required: true })
  message: string;

  @Prop({ type: Boolean, required: true, default: false })
  retryable: boolean;

  @Prop({ type: Number, default: null })
  providerStatus: number | null;
}
