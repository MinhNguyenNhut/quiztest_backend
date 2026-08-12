import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsString, IsNotEmpty } from 'class-validator';

export type SubmissionStatus =
	| 'in_progress'
	| 'submitted'
	| 'expired'
	| 'graded';

export class CreateSubmissionDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	quizId!: string;

	@ApiProperty({ type: Object })
	@IsObject()
	candidate!: Record<string, any>;
}
