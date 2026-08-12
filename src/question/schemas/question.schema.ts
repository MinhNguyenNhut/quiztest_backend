import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Difficulty } from '../../common/types/difficulty.type';
import {
  BlankDefinitionDto,
  ChildQuestionDto,
  ContentDto,
  MatchingPairDto,
  QuestionOptionDto,
  QuestionType,
  RichTextContentDto,
} from '../../common/types/question-content.type';

export type QuestionDocument = Question & Document;

@Schema({ _id: false })
export class QuestionOption implements QuestionOptionDto {
  @Prop({ required: true })
  id!: string;

  @Prop({ required: true })
  text!: string;

  @Prop({ required: true, default: false })
  isCorrect!: boolean;

  @Prop({ required: true, default: 0 })
  order!: number;
}

export const QuestionOptionSchema = SchemaFactory.createForClass(QuestionOption);

@Schema({ _id: false })
export class BlankDefinition implements BlankDefinitionDto {
  @Prop({ required: true })
  id!: string;

  @Prop({ required: true })
  label!: string;

  @Prop()
  correctAnswer?: string;
}

export const BlankDefinitionSchema =
  SchemaFactory.createForClass(BlankDefinition);

@Schema({ _id: false })
export class MatchingPair implements MatchingPairDto {
  @Prop({ required: true })
  id!: string;

  @Prop({ required: true })
  left!: string;

  @Prop({ required: true })
  right!: string;
}

export const MatchingPairSchema = SchemaFactory.createForClass(MatchingPair);

@Schema({ _id: false })
export class RichTextContent implements RichTextContentDto {
  @Prop({ required: true })
  html!: string;

  @Prop({ required: true })
  text!: string;
}

export const RichTextContentSchema =
  SchemaFactory.createForClass(RichTextContent);

@Schema({ _id: false })
export class Content implements ContentDto {
  @Prop({ required: true })
  html!: string;

  @Prop({ required: true })
  text!: string;

  @Prop({ type: [BlankDefinitionSchema], default: undefined })
  blanks?: BlankDefinition[];
}

export const ContentSchema = SchemaFactory.createForClass(Content);

@Schema({ _id: false })
export class ChildQuestion implements ChildQuestionDto {
  @Prop({ required: true, enum: Object.values(QuestionType) })
  type!: QuestionType;

  @Prop({ required: true })
  id!: string;

  @Prop({ required: true })
  title!: string;

  @Prop({ type: ContentSchema, required: false })
  content?: Content;

  @Prop()
  description?: string;

  @Prop({ required: true, default: 1 })
  points!: number;

  @Prop({ required: true, enum: Object.values(Difficulty) })
  difficulty!: Difficulty;

  @Prop()
  topic?: string;

  @Prop({ type: [String], default: [] })
  tags?: string[];

  @Prop()
  estimatedTime?: number;

  @Prop({ required: true, default: 0 })
  order!: number;

  @Prop({ type: [QuestionOptionSchema], default: [] })
  options?: QuestionOption[];

  @Prop({ type: RichTextContentSchema, required: false })
  explanation?: RichTextContent;

  @Prop({ type: [BlankDefinitionSchema], default: [] })
  blanks?: BlankDefinition[];

  @Prop({ type: [MatchingPairSchema], default: [] })
  matchingPairs?: MatchingPair[];

  @Prop()
  expectedAnswer?: string;

  @Prop({ default: false })
  caseSensitive?: boolean;

  @Prop({ type: RichTextContentSchema, required: false })
  rubric?: RichTextContent;

  @Prop()
  scoringGuide?: string;
}

export const ChildQuestionSchema = SchemaFactory.createForClass(ChildQuestion);

@Schema({ collection: 'questions', timestamps: true })
export class Question {
  @Prop({ type: Types.ObjectId, ref: 'Quiz', required: true, index: true })
  quizId!: Types.ObjectId;

  @Prop({ required: true, enum: Object.values(QuestionType) })
  type!: QuestionType;

  @Prop({ required: true })
  title!: string;

  @Prop({ type: ContentSchema, required: true })
  content!: Content;

  @Prop()
  description?: string;

  @Prop({ required: true, default: 1 })
  points!: number;

  @Prop({ required: true, enum: Object.values(Difficulty), default: Difficulty.MEDIUM })
  difficulty!: Difficulty;

  @Prop()
  topic?: string;

  @Prop({ type: [String], default: [] })
  tags!: string[];

  @Prop()
  estimatedTime?: number;

  @Prop({ required: true, default: 0 })
  order!: number;

  @Prop({ type: [QuestionOptionSchema], default: [] })
  options!: QuestionOption[];

  @Prop({ type: RichTextContentSchema, required: false })
  explanation?: RichTextContent;

  @Prop({ type: [BlankDefinitionSchema], default: [] })
  blanks?: BlankDefinition[];

  @Prop({ type: [MatchingPairSchema], default: [] })
  matchingPairs?: MatchingPair[];

  @Prop({ type: RichTextContentSchema, required: false })
  passage?: RichTextContent;

  @Prop({ type: [ChildQuestionSchema], default: [] })
  childQuestions?: ChildQuestion[];

  @Prop()
  expectedAnswer?: string;

  @Prop({ default: false })
  caseSensitive?: boolean;

  @Prop({ type: RichTextContentSchema, required: false })
  rubric?: RichTextContent;

  @Prop()
  scoringGuide?: string;

  createdAt!: Date;
  updatedAt!: Date;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);

QuestionSchema.index({ quizId: 1, order: 1 });
QuestionSchema.index({ type: 1 });
// transform output to frontend-friendly shape
QuestionSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (_doc: any, ret: any) {
    ret.id = ret._id?.toString();
    delete ret._id;
    return ret;
  },
});
