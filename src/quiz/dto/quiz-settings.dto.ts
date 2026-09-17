import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, Min, Max } from 'class-validator';

export class QuizSettingsDto {
  @ApiProperty({ example: true })
  @IsBoolean()
  showResultsPage!: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  showScore!: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  showPassFailStatus!: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  showCorrectAnswers!: boolean;

  @ApiProperty({ example: false })
  @IsBoolean()
  showExplanations!: boolean;

  @ApiProperty({ example: false })
  @IsBoolean()
  allowRetry!: boolean;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @Min(0)
  maxAttempts!: number;

  @ApiProperty({ example: false })
  @IsBoolean()
  shuffleQuestions!: boolean;

  @ApiProperty({ example: false })
  @IsBoolean()
  shuffleOptions!: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  allowBackwardNavigation!: boolean;
  
  @ApiProperty({ example: 70 })
  @IsNumber()
  @Min(0)
  @Max(100)
  passingScorePercentage!: number;

  @ApiProperty({ example: true })
  @IsBoolean()
  unlimitedTime!: boolean;
}
