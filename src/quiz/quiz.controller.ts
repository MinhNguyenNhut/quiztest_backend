import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { ReorderQuestionsDto } from './dto/reorder-questions.dto';

@Controller('api/quizzes')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post()
  create(@Body() createQuizDto: CreateQuizDto) {
    return this.quizService.create(createQuizDto);
  }

  @Get()
  findAll(@Query('page') page = '1', @Query('limit') limit = '20') {
    return this.quizService.findAll(Number(page), Number(limit));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quizService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQuizDto: UpdateQuizDto) {
    return this.quizService.update(id, updateQuizDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.quizService.remove(id);
  }

  @Patch(':id/candidate-fields')
  patchCandidateFields(@Param('id') id: string, @Body() body: any) {
    return this.quizService.patchCandidateFields(id, body);
  }

  @Patch(':id/questions/reorder')
  reorderQuestions(@Param('id') id: string, @Body() dto: ReorderQuestionsDto) {
    return this.quizService.reorderQuestions(id, dto);
  }

  @Get(':id/questions')
  getQuestions(@Param('id') id: string) {
    return this.quizService.getQuestions(id);
  }
}
