import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CandidateFieldsConfigDto } from '../../common/types/candidate-fields.type';
import { QuizSettingsDto } from './quiz-settings.dto';

export class CreateQuizDto {
  @ApiProperty()
  @IsString()
  title!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  coverImage?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  estimatedTime?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  passingScore?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  createdBy?: string;

  @ApiProperty({ type: CandidateFieldsConfigDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => CandidateFieldsConfigDto)
  candidateFieldsConfig?: CandidateFieldsConfigDto;

  @ApiProperty({ type: QuizSettingsDto, required: false }) // <-- Add this
  @IsOptional()
  @ValidateNested()
  @Type(() => QuizSettingsDto)
  settings?: QuizSettingsDto;

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  questionIds?: string[];
}
