import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';
import { Submission, SubmissionDocument } from './schemas/submission.schema';
import { Quiz, QuizDocument } from '../quiz/schemas/quiz.schema';
import { Question, QuestionDocument } from '../question/schemas/question.schema';
import { SaveAnswerDto } from './dto/save-answer.dto';
import { GradingService } from './grading/grading.service';
import { SubmitSubmissionDto } from './dto/submit-submission.dto';

@Injectable()
export class SubmissionService {
  constructor(
    @InjectModel(Submission.name) private submissionModel: Model<SubmissionDocument>,
    @InjectModel(Quiz.name) private quizModel: Model<QuizDocument>,
    @InjectModel(Question.name) private questionModel: Model<QuestionDocument>,
    private gradingService: GradingService,
  ) {}

  async create(dto: CreateSubmissionDto) {
    const quiz = await this.quizModel.findById(dto.quizId);
    if (!quiz) throw new NotFoundException('Quiz not found');
    const now = new Date();
    const created = await this.submissionModel.create({
      quizId: quiz._id,
      candidate: dto.candidate,
      answers: {},
      flags: [],
      bookmarks: [],
      startedAt: now,
      status: 'in_progress',
    } as any);
    return created.toJSON();
  }

  async findOne(id: string) {
    const s = await this.submissionModel.findById(id).lean();
    if (!s) throw new NotFoundException('Submission not found');
    return { ...s, id: s._id?.toString() };
  }

  async saveAnswer(id: string, dto: SaveAnswerDto) {
    const submission = await this.submissionModel.findById(id);
    if (!submission) throw new NotFoundException('Submission not found');
    if (submission.status !== 'in_progress') throw new ForbiddenException('Submission already submitted');
    // verify question belongs to quiz
    const question = await this.questionModel.findById(dto.questionId).lean();
    if (!question) throw new NotFoundException('Question not found');
    if (question.quizId.toString() !== submission.quizId.toString()) throw new BadRequestException('Question does not belong to quiz');

    // efficient update using $set
    const key = `answers.${dto.questionId}`;
    await this.submissionModel.updateOne({ _id: submission._id }, { $set: { [key]: dto.value } });
    const updated = await this.submissionModel.findById(id).lean();
    if (!updated) throw new NotFoundException('Submission not found after update');
    return { ...updated, id: updated._id?.toString() };
  }

  async toggleFlag(id: string, questionId: string) {
    const submission = await this.submissionModel.findById(id);
    if (!submission) throw new NotFoundException('Submission not found');
    const exists = submission.flags.includes(questionId);
    if (exists) await this.submissionModel.updateOne({ _id: submission._id }, { $pull: { flags: questionId } });
    else await this.submissionModel.updateOne({ _id: submission._id }, { $addToSet: { flags: questionId } });
    const updated = await this.submissionModel.findById(id).lean();
    if (!updated) throw new NotFoundException('Submission not found after flag update');
    return { ...updated, id: updated._id?.toString() };
  }

  async toggleBookmark(id: string, questionId: string) {
    const submission = await this.submissionModel.findById(id);
    if (!submission) throw new NotFoundException('Submission not found');
    const exists = submission.bookmarks.includes(questionId);
    if (exists) await this.submissionModel.updateOne({ _id: submission._id }, { $pull: { bookmarks: questionId } });
    else await this.submissionModel.updateOne({ _id: submission._id }, { $addToSet: { bookmarks: questionId } });
    const updated = await this.submissionModel.findById(id).lean();
    if (!updated) throw new NotFoundException('Submission not found after bookmark update');
    return { ...updated, id: updated._id?.toString() };
  }

  async submit(id: string, dto?: SubmitSubmissionDto) {
    const submission = await this.submissionModel.findById(id).lean();
    if (!submission) throw new NotFoundException('Submission not found');
    if (submission.status !== 'in_progress') throw new BadRequestException('Submission already submitted');

    const quiz = await this.quizModel.findById(submission.quizId).lean();
    if (!quiz) throw new NotFoundException('Quiz not found');

    // load questions
    const questions = await this.questionModel.find({ quizId: quiz._id }).lean();

    // grade
    let totalPossible = 0;
    let totalEarned = 0;
    for (const q of questions) {
      totalPossible += q.points ?? 1;
      const answer = (submission.answers ?? {})[q._id.toString()];
      const result = this.gradingService.gradeQuestion(q, answer);
      totalEarned += result.earned;
    }

    const percentage = totalPossible > 0 ? Math.round((totalEarned / totalPossible) * 100) : 0;

    // expiration check
    if (quiz.estimatedTime && submission.startedAt) {
      const started = new Date(submission.startedAt);
      const elapsed = (Date.now() - started.getTime()) / 1000;
      if (quiz.estimatedTime > 0 && elapsed > quiz.estimatedTime) {
        // mark expired
        await this.submissionModel.updateOne({ _id: submission._id }, { $set: { status: 'expired', submittedAt: new Date(), score: totalEarned, percentage } });
        const updated = await this.submissionModel.findById(id).lean();
        if (!updated) throw new NotFoundException('Submission not found after expire update');
        return { ...updated, id: updated._id?.toString() };
      }
    }

    // finalize
    await this.submissionModel.updateOne({ _id: submission._id }, { $set: { status: 'submitted', submittedAt: new Date(), score: totalEarned, percentage, timeSpentSeconds: dto?.timeSpentSeconds } });
    const updated = await this.submissionModel.findById(id).lean();
    if (!updated) throw new NotFoundException('Submission not found after submit');
    return { ...updated, id: updated._id?.toString() };
  }

  async findByQuiz(quizId: string) {
    const subs = await this.submissionModel.find({ quizId }).sort({ createdAt: -1 }).lean();
    return subs.map((s) => ({ ...s, id: s._id?.toString() }));
  }
}
