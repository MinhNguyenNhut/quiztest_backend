import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { QuizModule } from './quiz/quiz.module';
import { QuestionModule } from './question/question.module';
import { SubmissionModule } from './submission/submission.module';
import { CandidateModule } from './candidate/candidate.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_URI ?? ''),
    QuizModule,
    QuestionModule,
    SubmissionModule,
    CandidateModule,
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
