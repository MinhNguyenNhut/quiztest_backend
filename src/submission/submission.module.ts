import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SubmissionService } from './submission.service';
import { SubmissionController } from './submission.controller';
import { Submission, SubmissionSchema } from './schemas/submission.schema';
import { QuizModule } from '../quiz/quiz.module';
import { QuestionModule } from '../question/question.module';
import { GradingService } from './grading/grading.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Submission.name, schema: SubmissionSchema }]),
    forwardRef(() => QuizModule),
    forwardRef(() => QuestionModule),
  ],
  controllers: [SubmissionController],
  providers: [SubmissionService, GradingService],
  exports: [SubmissionService],
})
export class SubmissionModule {}
