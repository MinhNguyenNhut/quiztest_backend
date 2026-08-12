import { Injectable } from '@nestjs/common';

@Injectable()
export class GradingService {
  gradeQuestion(question: any, answer: any): { earned: number; possible: number } {
    const possible = question.points ?? 1;
    let earned = 0;
    switch (question.type) {
      case 'single_choice': {
        const correct = question.options?.find((o: any) => o.isCorrect);
        if (answer?.optionId && correct && answer.optionId === correct.id) earned = possible;
        break;
      }
      case 'true_false': {
        if (typeof answer?.value === 'boolean' && String(answer.value) === String(question.expectedAnswer)) earned = possible;
        break;
      }
      case 'multiple_choice': {
        const correctIds = (question.options ?? []).filter((o: any) => o.isCorrect).map((o: any) => o.id).sort();
        const selected = (answer?.optionIds ?? []).slice().sort();
        if (JSON.stringify(correctIds) === JSON.stringify(selected)) earned = possible;
        break;
      }
      case 'fill_in_blank': {
        // answer.values: Record<blankId, string>
        const blanks = question.blanks ?? [];
        const total = blanks.length || 1;
        let correctCount = 0;
        for (const b of blanks) {
          const given = (answer?.values ?? {})[b.id];
          if (given == null) continue;
          if (question.caseSensitive) {
            if (given === b.correctAnswer) correctCount++;
          } else {
            if (String(given).trim().toLowerCase() === String(b.correctAnswer ?? '').trim().toLowerCase()) correctCount++;
          }
        }
        earned = Math.round((possible * correctCount) / total);
        break;
      }
      case 'matching': {
        const pairs = question.matchingPairs ?? [];
        const submitted = answer?.pairs ?? {};
        const total = pairs.length || 1;
        let correctCount = 0;
        for (const p of pairs) {
          if (submitted[p.id] && submitted[p.id] === p.right) correctCount++;
        }
        earned = Math.round((possible * correctCount) / total);
        break;
      }
      case 'short_answer': {
        const expected = (question.expectedAnswer ?? '').toString().trim();
        const got = (answer?.text ?? '').toString().trim();
        if (question.caseSensitive) {
          if (got === expected) earned = possible;
        } else {
          if (got.toLowerCase() === expected.toLowerCase()) earned = possible;
        }
        break;
      }
      default:
        earned = 0;
    }
    return { earned, possible };
  }
}
