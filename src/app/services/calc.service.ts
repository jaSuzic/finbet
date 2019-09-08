import { Injectable } from '@angular/core';

import { WordsService } from './words.service';

@Injectable({
  providedIn: "root"
})
export class CalcService {
  constructor(private wordService: WordsService) {}

  makeCorrectArrayOfWords(words: string) {
    //regex which match all alphanumerics and spaces
    let regex = /[^A-Za-z0-9\s]/g;
    //regex which match / = + - and new lines
    let regexNewLine = /[\t\/\=\+\-\r?\n|\r]/g;
    return words
      .toLowerCase()
      .replace(regexNewLine, " ")
      .replace(regex, "")
      .split(" ")
      .filter(word => word != "");
  }

  calculate(words: Array<string>) {
    console.log("TCL: CalcService -> calculate -> words", words);
    let currentDb = this.wordService.getCurrentDb();
    let sum = 0;
    for (let i = 0; i < words.length; i++) {
      for (let j = 0; j < currentDb.length; j++) {
        if (words[i] === currentDb[j].word.toLowerCase()) {
          sum += currentDb[j].grade;
          console.log(
            "TCL: CalcService -> calculate -> words[i]",
            words[i],
            sum
          );
        }
      }
    }
    return sum;
  }
}
