import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Difficulty } from '../../common/types/difficulty.type';
import {
  BlankDefinitionDto,
  ChildQuestionDto,
  ContentDto,
  MatchingPairDto,
  QuestionOptionDto,
  QuestionType,
  RichTextContentDto,
} from '../../common/types/question-content.type';

export class CreateQuestionDto {
  @ApiProperty({ enum: QuestionType })
  @IsEnum(QuestionType)
  type!: QuestionType;

  @ApiProperty()
  @IsString()
  title!: string;

  @ApiProperty({ type: ContentDto })
  @ValidateNested()
  @Type(() => ContentDto)
  content!: ContentDto;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ default: 1 })
  @IsNumber()
  points!: number;

  @ApiProperty({ enum: Difficulty, default: Difficulty.MEDIUM })
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

  @ApiProperty({ default: 0 })
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

  @ApiProperty({ type: RichTextContentDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => RichTextContentDto)
  passage?: RichTextContentDto;

  @ApiProperty({ type: [ChildQuestionDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChildQuestionDto)
  childQuestions?: ChildQuestionDto[];

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
