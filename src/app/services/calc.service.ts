import { Injectable } from '@angular/core';

import { WordsService } from './words.service';

@Injectable({
  providedIn: "root"
})
export class CalcService {
  constructor(private wordService: WordsService) {}

  calculate(words: Array<string>) {
    let currentDb = this.wordService.getCurrentDb();
    let sum = 0;
    for (let i = 0; i < words.length; i++) {
      for (let j = 0; j < currentDb.length; j++) {
        if (words[i] === currentDb[j].word.toLowerCase()) {
          sum += currentDb[j].grade;
        }
      }
    }
    return sum;
  }
}
