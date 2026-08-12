import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { Quiz, QuizDocument } from './schemas/quiz.schema';
import { Question, QuestionDocument } from '../question/schemas/question.schema';
import { ReorderQuestionsDto } from './dto/reorder-questions.dto';

@Injectable()
export class QuizService {
  constructor(
    @InjectModel(Quiz.name) private quizModel: Model<QuizDocument>,
    @InjectModel(Question.name) private questionModel: Model<QuestionDocument>,
  ) {}

  async create(dto: CreateQuizDto) {
    const created = await this.quizModel.create(dto as any);
    return created.toJSON();
  }

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.quizModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      this.quizModel.countDocuments(),
    ]);
    return {
      data: items.map((i) => ({ ...i, id: i._id?.toString() })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const quiz = await this.quizModel.findById(id).lean();
    if (!quiz) throw new NotFoundException('Quiz not found');
    const questions = await this.questionModel.find({ quizId: quiz._id }).sort({ order: 1 }).lean();
    // map ids
    return { ...quiz, id: quiz._id.toString(), questions: questions.map((q) => ({ ...q, id: q._id?.toString() })) };
  }

  async update(id: string, dto: UpdateQuizDto) {
    const updated = await this.quizModel.findByIdAndUpdate(id, dto as any, { new: true }).lean();
    if (!updated) throw new NotFoundException('Quiz not found');
    return { ...updated, id: updated._id?.toString() };
  }

  async remove(id: string) {
    const quiz = await this.quizModel.findById(id);
    if (!quiz) throw new NotFoundException('Quiz not found');
    // delete associated questions
    await this.questionModel.deleteMany({ quizId: quiz._id });
    await quiz.deleteOne();
    return { success: true };
  }

  async patchCandidateFields(id: string, candidateFieldsConfig: any) {
    const updated = await this.quizModel.findByIdAndUpdate(id, { candidateFieldsConfig }, { new: true }).lean();
    if (!updated) throw new NotFoundException('Quiz not found');
    return { ...updated, id: updated._id?.toString() };
  }

  async reorderQuestions(id: string, dto: ReorderQuestionsDto) {
    const quiz = await this.quizModel.findById(id);
    if (!quiz) throw new NotFoundException('Quiz not found');
    quiz.questionIds = dto.questionIds.map((s) => new Types.ObjectId(s));
    await quiz.save();
    return { id: quiz._id.toString(), questionIds: quiz.questionIds.map((q) => q.toString()) };
  }

  async getQuestions(id: string) {
    const quiz = await this.quizModel.findById(id);
    if (!quiz) throw new NotFoundException('Quiz not found');
    const questions = await this.questionModel.find({ quizId: quiz._id }).sort({ order: 1 }).lean();
    return questions.map((q) => ({ ...q, id: q._id?.toString() }));
  }
}
