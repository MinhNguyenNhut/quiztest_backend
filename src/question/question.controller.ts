import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

@Controller('api')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post('quizzes/:quizId/questions')
  create(@Param('quizId') quizId: string, @Body() createQuestionDto: CreateQuestionDto) {
    return this.questionService.create(quizId, createQuestionDto);
  }

  @Get('quizzes/:quizId/questions')
  findAllForQuiz(@Param('quizId') quizId: string) {
    return this.questionService.findAllForQuiz(quizId);
  }

  @Get('questions/:id')
  findOne(@Param('id') id: string) {
    return this.questionService.findOne(id);
  }

  @Patch('questions/:id')
  update(@Param('id') id: string, @Body() updateQuestionDto: UpdateQuestionDto) {
    return this.questionService.update(id, updateQuestionDto);
  }

  @Delete('questions/:id')
  remove(@Param('id') id: string) {
    return this.questionService.remove(id);
  }

  @Patch('quizzes/:quizId/questions/reorder')
  reorder(@Param('quizId') quizId: string, @Body() body: { questionIds: string[] }) {
    return this.questionService.reorder(quizId, body.questionIds);
  }
}
