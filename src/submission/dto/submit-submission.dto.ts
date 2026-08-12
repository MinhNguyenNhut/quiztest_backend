import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber } from 'class-validator';

export class SubmitSubmissionDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  timeSpentSeconds?: number;
}
