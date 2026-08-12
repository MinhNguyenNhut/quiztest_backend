import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Question, QuestionDocument } from './schemas/question.schema';
import { Quiz, QuizDocument } from '../quiz/schemas/quiz.schema';

@Injectable()
export class QuestionService {
  constructor(
    @InjectModel(Question.name) private questionModel: Model<QuestionDocument>,
    @InjectModel(Quiz.name) private quizModel: Model<QuizDocument>,
  ) {}

  async create(quizId: string, dto: CreateQuestionDto) {
    const quiz = await this.quizModel.findById(quizId);
    if (!quiz) throw new NotFoundException('Quiz not found');
    const toCreate: any = { ...dto, quizId: new Types.ObjectId(quizId) };
    const created = await this.questionModel.create(toCreate);
    // add to quiz.questionIds
    quiz.questionIds.push(created._id);
    await quiz.save();
    return { ...created.toJSON(), id: created._id.toString() };
  }

  async findAllForQuiz(quizId: string) {
    const quiz = await this.quizModel.findById(quizId);
    if (!quiz) throw new NotFoundException('Quiz not found');
    const questions = await this.questionModel.find({ quizId: quiz._id }).sort({ order: 1 }).lean();
    return questions.map((q) => ({ ...q, id: q._id?.toString() }));
  }

  async findOne(id: string) {
    const q = await this.questionModel.findById(id).lean();
    if (!q) throw new NotFoundException('Question not found');
    return { ...q, id: q._id?.toString() };
  }

  async update(id: string, dto: UpdateQuestionDto) {
    const updated = await this.questionModel.findByIdAndUpdate(id, dto as any, { new: true }).lean();
    if (!updated) throw new NotFoundException('Question not found');
    return { ...updated, id: updated._id?.toString() };
  }

  async remove(id: string) {
    const q = await this.questionModel.findById(id);
    if (!q) throw new NotFoundException('Question not found');
    // remove from quiz
    await this.quizModel.updateOne({ _id: q.quizId }, { $pull: { questionIds: q._id } });
    await q.deleteOne();
    return { success: true };
  }

  async reorder(quizId: string, questionIds: string[]) {
    const quiz = await this.quizModel.findById(quizId);
    if (!quiz) throw new NotFoundException('Quiz not found');
    // validate ids
    const all = questionIds.every((id) => Types.ObjectId.isValid(id));
    if (!all) throw new BadRequestException('Invalid question id in list');
    quiz.questionIds = questionIds.map((s) => new Types.ObjectId(s));
    await quiz.save();
    return { questionIds: quiz.questionIds.map((q) => q.toString()) };
  }
}
