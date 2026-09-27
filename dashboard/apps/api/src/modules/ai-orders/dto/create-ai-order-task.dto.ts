import { IsIn, IsObject, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export class CreateAiOrderTaskDto {
  @IsString() @MaxLength(100) client_request_id: string;
  @IsString() @MaxLength(100) user_id: string;
  @IsIn(['1688', 'taobao', 'tmall']) platform: '1688' | 'taobao' | 'tmall';
  @IsUrl({ protocols: ['http', 'https'], require_protocol: true }) page_url: string;
  @IsOptional() @IsString() @MaxLength(2000) user_note?: string;
  @IsObject() snapshot: Record<string, unknown>;
}
