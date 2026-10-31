import { Injectable } from '@angular/core';
import { Question } from '../model/question';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class QuestionService extends BaseService<Question> {
  override entity = 'question';
}
