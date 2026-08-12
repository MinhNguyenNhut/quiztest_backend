import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class SaveAnswerDto {
  @ApiProperty()
  @IsString()
  questionId!: string;

  @ApiProperty({ type: Object })
  @IsObject()
  @ValidateNested()
  @Type(() => Object)
  value!: Record<string, any>;
}
