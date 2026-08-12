import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Difficulty } from '../../common/types/difficulty.type';
import { CandidateFieldsConfigDto } from '../../common/types/candidate-fields.type';

export type QuizDocument = Quiz & Document;

@Schema({ collection: 'quizzes', timestamps: true })
export class Quiz {
  @ApiProperty()
  @Prop({ required: true })
  title!: string;

  @ApiProperty({ required: false })
  @Prop()
  description?: string;

  @ApiProperty({ required: false })
  @Prop()
  coverImage?: string;

  @ApiProperty({ required: false })
  @Prop()
  estimatedTime?: number; // seconds

  @ApiProperty({ required: false })
  @Prop()
  passingScore?: number;

  @ApiProperty({ enum: Difficulty })
  @Prop({ enum: Object.values(Difficulty), default: Difficulty.MEDIUM })
  difficulty!: Difficulty;

  @ApiProperty({ required: false })
  @Prop()
  createdBy?: string;

  @ApiProperty({ type: Object, required: false })
  @Prop({ type: MongooseSchema.Types.Mixed })
  candidateFieldsConfig?: CandidateFieldsConfigDto;

  @ApiProperty({ type: [String] })
  @Prop({ type: [Types.ObjectId], ref: 'Question', default: [] })
  questionIds!: Types.ObjectId[];

  createdAt!: Date;
  updatedAt!: Date;
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);

QuizSchema.index({ createdBy: 1 });
QuizSchema.index({ createdAt: 1 });

QuizSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (_doc: any, ret: any) {
    ret.id = ret._id?.toString();
    delete ret._id;
    return ret;
  },
});
