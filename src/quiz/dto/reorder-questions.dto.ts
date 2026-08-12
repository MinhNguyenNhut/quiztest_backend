import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class ReorderQuestionsDto {
  @ApiProperty({ type: [String] })
  @IsArray()
  questionIds!: string[];
}
