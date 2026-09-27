import { IsBoolean, IsNumber, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class CreateOpenAiKeyDto {
  @IsString() @MinLength(1) name: string;
  @IsString() @MinLength(1) apiKey: string;
  @IsString() @MinLength(1) model: string;
  @IsNumber() @Min(0) inputPricePerMillion: number;
  @IsNumber() @Min(0) cachedInputPricePerMillion: number;
  @IsNumber() @Min(0) outputPricePerMillion: number;
  @IsOptional() @IsBoolean() enabled?: boolean;
  @IsOptional() @IsBoolean() isDefault?: boolean;
}

export class UpdateOpenAiKeyDto {
  @IsOptional() @IsString() @MinLength(1) name?: string;
  @IsOptional() @IsString() @MinLength(1) apiKey?: string;
  @IsOptional() @IsString() @MinLength(1) model?: string;
  @IsOptional() @IsNumber() @Min(0) inputPricePerMillion?: number;
  @IsOptional() @IsNumber() @Min(0) cachedInputPricePerMillion?: number;
  @IsOptional() @IsNumber() @Min(0) outputPricePerMillion?: number;
  @IsOptional() @IsBoolean() enabled?: boolean;
  @IsOptional() @IsBoolean() isDefault?: boolean;
}
