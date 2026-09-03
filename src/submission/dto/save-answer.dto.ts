import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsString } from 'class-validator';

export class SaveAnswerDto {
  @ApiProperty()
  @IsString()
  questionId!: string;

  @ApiProperty({ type: Object })
  @IsObject()
  value!: Record<string, any>;
}
