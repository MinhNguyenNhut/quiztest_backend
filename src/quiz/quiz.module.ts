import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { QuizService } from './quiz.service';
import { QuizController } from './quiz.controller';
import { Quiz, QuizSchema } from './schemas/quiz.schema';
import { QuestionModule } from '../question/question.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Quiz.name,
        schema: QuizSchema,
      },
    ]),

    forwardRef(() => QuestionModule),
  ],

  controllers: [QuizController],

  providers: [QuizService],

  exports: [
    QuizService,
    MongooseModule,
  ],
})
export class QuizModule {}
