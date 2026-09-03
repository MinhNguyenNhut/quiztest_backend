import { Controller, Get, Post, Body, Patch, Delete, Param } from '@nestjs/common';
import { SubmissionService } from './submission.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { SaveAnswerDto } from './dto/save-answer.dto';
import { SubmitSubmissionDto } from './dto/submit-submission.dto';

@Controller('api/submissions')
export class SubmissionController {
  constructor(private readonly submissionService: SubmissionService) {}

  @Post()
  create(@Body() createSubmissionDto: CreateSubmissionDto) {
    return this.submissionService.create(createSubmissionDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.submissionService.findOne(id);
  }

  @Patch(':id/answer')
  saveAnswer(@Param('id') id: string, @Body() dto: SaveAnswerDto) {
    return this.submissionService.saveAnswer(id, dto);
  }

  @Patch(':id/flag')
  flag(@Param('id') id: string, @Body() body: { questionId: string }) {
    return this.submissionService.toggleFlag(id, body.questionId);
  }

  @Patch(':id/bookmark')
  bookmark(@Param('id') id: string, @Body() body: { questionId: string }) {
    return this.submissionService.toggleBookmark(id, body.questionId);
  }

  @Post(':id/submit')
  submit(@Param('id') id: string, @Body() dto: SubmitSubmissionDto) {
    return this.submissionService.submit(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.submissionService.remove(id);
  }

  @Get('quiz/:quizId')
  getByQuiz(@Param('quizId') quizId: string) {
    return this.submissionService.findByQuiz(quizId);
  }
}
