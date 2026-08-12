import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import type { SubmissionStatus } from '../dto/create-submission.dto';

export type SubmissionDocument = Submission & Document;

@Schema({ collection: 'submissions', timestamps: true })
export class Submission {
  @ApiProperty()
  @Prop({
    type: Types.ObjectId,
    ref: 'Quiz',
    required: true,
  })
  quizId!: Types.ObjectId;

  @ApiProperty({ type: Object })
  @Prop({
    type: MongooseSchema.Types.Mixed,
    required: true,
  })
  candidate!: Record<string, any>;

  @ApiProperty({ type: Object })
  @Prop({
    type: MongooseSchema.Types.Mixed,
    default: {},
  })
  answers!: Record<string, any>;

  @ApiProperty({ type: [String] })
  @Prop({
    type: [String],
    default: [],
  })
  flags!: string[];

  @ApiProperty({ type: [String] })
  @Prop({
    type: [String],
    default: [],
  })
  bookmarks!: string[];

  @ApiProperty()
  @Prop()
  startedAt!: Date;

  @ApiProperty({ required: false })
  @Prop()
  submittedAt?: Date;

  @ApiProperty({ required: false })
  @Prop()
  timeSpentSeconds?: number;

  @ApiProperty({ required: false })
  @Prop()
  score?: number;

  @ApiProperty({ required: false })
  @Prop()
  percentage?: number;

  @ApiProperty({
    enum: ['in_progress', 'submitted', 'expired', 'graded'],
  })
  @Prop({
    enum: ['in_progress', 'submitted', 'expired', 'graded'],
    default: 'in_progress',
  })
  status!: SubmissionStatus;

  createdAt!: Date;
  updatedAt!: Date;
}

export const SubmissionSchema = SchemaFactory.createForClass(Submission);

// Indexes
SubmissionSchema.index({ quizId: 1 });
SubmissionSchema.index({ status: 1 });
SubmissionSchema.index({ startedAt: 1 });

SubmissionSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (_doc: any, ret: any) {
    ret.id = ret._id?.toString();
    delete ret._id;
    return ret;
  },
});
