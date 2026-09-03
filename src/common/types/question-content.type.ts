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
import { Difficulty } from './difficulty.type';

export enum QuestionType {
  SINGLE_CHOICE = 'single_choice',
  MULTIPLE_CHOICE = 'multiple_choice',
  TRUE_FALSE = 'true_false',
  FILL_IN_BLANK = 'fill_in_blank',
  MATCHING = 'matching',
  READING_COMPREHENSION = 'reading_comprehension',
  SHORT_ANSWER = 'short_answer',
  ESSAY = 'essay',
}

export class RichTextContentDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  html?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  text?: string;
}

export class BlankDefinitionDto {
  @ApiProperty()
  @IsString()
  id!: string;

  @ApiProperty()
  @IsString()
  label!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  correctAnswer?: string;
}

export class QuestionOptionDto {
  @ApiProperty()
  @IsString()
  id!: string;

  @ApiProperty()
  @IsString()
  text!: string;

  @ApiProperty()
  @IsBoolean()
  isCorrect!: boolean;

  @ApiProperty()
  @IsNumber()
  order!: number;
}

export class MatchingPairDto {
  @ApiProperty()
  @IsString()
  id!: string;

  @ApiProperty()
  @IsString()
  left!: string;

  @ApiProperty()
  @IsString()
  right!: string;
}

export class ChildQuestionDto {
  @ApiProperty({ enum: QuestionType })
  @IsEnum(QuestionType)
  type!: QuestionType;

  @ApiProperty()
  @IsString()
  id!: string;

  @ApiProperty()
  @IsString()
  title!: string;

  @ApiProperty({ type: RichTextContentDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => RichTextContentDto)
  content?: RichTextContentDto;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsNumber()
  points!: number;

  @ApiProperty({ enum: Difficulty })
  @IsEnum(Difficulty)
  difficulty!: Difficulty;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  topic?: string;

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  tags?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  estimatedTime?: number;

  @ApiProperty()
  @IsNumber()
  order!: number;

  @ApiProperty({ type: [QuestionOptionDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionOptionDto)
  options?: QuestionOptionDto[];

  @ApiProperty({ type: RichTextContentDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => RichTextContentDto)
  explanation?: RichTextContentDto;

  @ApiProperty({ type: [BlankDefinitionDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BlankDefinitionDto)
  blanks?: BlankDefinitionDto[];

  @ApiProperty({ type: [MatchingPairDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MatchingPairDto)
  matchingPairs?: MatchingPairDto[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  expectedAnswer?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  caseSensitive?: boolean;

  @ApiProperty({ type: RichTextContentDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => RichTextContentDto)
  rubric?: RichTextContentDto;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  scoringGuide?: string;
}

export class ContentDto {
  @ApiProperty()
  @IsString()
  html!: string;

  @ApiProperty()
  @IsString()
  text!: string;

  @ApiProperty({ type: [BlankDefinitionDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BlankDefinitionDto)
  blanks?: BlankDefinitionDto[];
}
