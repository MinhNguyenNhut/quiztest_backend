import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import {
  Question,
  QuestionSchema,
} from './schemas/question.schema';

import { QuizModule } from '../quiz/quiz.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Question.name,
        schema: QuestionSchema,
      },
    ]),

    forwardRef(() => QuizModule),
  ],

  controllers: [QuestionController],

  providers: [QuestionService],

  exports: [
    QuestionService,
    MongooseModule,
  ],
})
export class QuestionModule {}
