import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export enum CandidateFieldType {
  TEXT = 'text',
  EMAIL = 'email',
  PHONE = 'phone',
  SELECT = 'select',
  RADIO = 'radio',
  CHECKBOX = 'checkbox',
  TEXTAREA = 'textarea',
  DATE = 'date',
  NUMBER = 'number',
}

export class CandidateFieldOptionDto {
  @ApiProperty()
  @IsString()
  label!: string;

  @ApiProperty()
  @IsString()
  value!: string;
}

export class CandidateFieldValidationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  minLength?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  maxLength?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  min?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  max?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  pattern?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  customMessage?: string;
}

export class CandidateFieldVisibleIfDto {
  @ApiProperty()
  @IsString()
  fieldId!: string;

  @ApiProperty()
  equals!: string | number | boolean;
}

export class CandidateFieldDto {
  @ApiProperty()
  @IsString()
  id!: string;

  @ApiProperty({ enum: CandidateFieldType })
  @IsEnum(CandidateFieldType)
  type!: CandidateFieldType;

  @ApiProperty()
  @IsString()
  label!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  placeholder?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  helpText?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  defaultValue?: string | number | boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  required?: boolean;

  @ApiProperty({ type: [CandidateFieldOptionDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CandidateFieldOptionDto)
  options?: CandidateFieldOptionDto[];

  @ApiProperty({ type: CandidateFieldValidationDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => CandidateFieldValidationDto)
  validation?: CandidateFieldValidationDto;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  order?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  section?: string;

  @ApiProperty({ type: CandidateFieldVisibleIfDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => CandidateFieldVisibleIfDto)
  visibleIf?: CandidateFieldVisibleIfDto;
}

export class CandidateFieldSectionDto {
  @ApiProperty()
  @IsString()
  id!: string;

  @ApiProperty()
  @IsString()
  title!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  order?: number;
}

export class CandidateFieldsConfigDto {
  @ApiProperty({ type: [CandidateFieldSectionDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CandidateFieldSectionDto)
  sections?: CandidateFieldSectionDto[];

  @ApiProperty({ type: [CandidateFieldDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CandidateFieldDto)
  fields?: CandidateFieldDto[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
