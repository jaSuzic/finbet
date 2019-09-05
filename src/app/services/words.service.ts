import { Injectable } from '@angular/core';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { BehaviorSubject, Subject } from 'rxjs';

import { Word } from '../models/word.model';
import { environment } from './../../environments/environment';

const BACKEND_URL = environment.apiUrl;
var currentDb: Array<Word>;
var dbSub = new Subject<Array<Word>>();

@Injectable({
  providedIn: "root"
})
export class WordsService {
  private dbUpdated = new BehaviorSubject(false);

  constructor(protected localStorage: LocalStorage) {}

  loadDb() {
    this.localStorage.getItem("lexicon_local").subscribe(
      res => {
        if (res) {
          if (typeof res === "string") {
            res = JSON.parse(res);
          }
          currentDb = res as Array<Word>;
          console.log(typeof res);
          dbSub.next(currentDb);
        } else {
          let defaultDb: Array<Word> = [
            { id: 1, word: "nice", grade: 0.4 },
            { id: 2, word: "excellent", grade: 0.8 },
            { id: 3, word: "modest", grade: 0 },
            { id: 4, word: "horrible", grade: -0.8 },
            { id: 5, word: "ugly", grade: -0.5 }
          ];
          this.localStorage.setItem("lexicon_local", defaultDb).subscribe(
            res => {
              console.log(res);
            },
            err => {
              console.log(err);
            }
          );
          currentDb = defaultDb;
          dbSub.next(currentDb);
        }
      },
      err => {}
    );

    return dbSub.asObservable();

    // return dbSub.asObservable();
    // if (localStorage.getItem("lexicon_local") === null) {
    //   let defaultDb: Array<Word> = [
    //     { id: 1, word: "nice", grade: 0.4 },
    //     { id: 2, word: "excellent", grade: 0.8 },
    //     { id: 3, word: "modest", grade: 0 },
    //     { id: 4, word: "horrible", grade: -0.8 },
    //     { id: 5, word: "ugly", grade: -0.5 }
    //   ];
    //   localStorage.setItem("lexicon_local", JSON.stringify(defaultDb));
    //   currentDb = defaultDb;
    // } else {
    //   let fetchedDb = JSON.parse(localStorage.getItem("lexicon_local"));
    //   currentDb = fetchedDb;
    // }
    // return currentDb;
  }

  getCurrentDb() {
    return currentDb;
  }

  getDbObs() {
    return dbSub.asObservable();
  }

  addNewWord(word: Word) {
    let maxId = currentDb.reduce((prev, current) =>
      prev.id > current.id ? prev : current
    );
    let newWord = new Word();
    newWord.id = maxId.id + 1;
    newWord.word = word.word;
    newWord.grade = word.grade;
    currentDb.push(newWord);
    // this.dbUpdated.next(true);
    dbSub.next(currentDb);

    // this.saveDb(currentDb);
    return this.localStorage.setItem("lexicon_local", currentDb);
  }

  updateWord(data: Word) {
    let position = currentDb.map(word => word.id).indexOf(data.id);
    console.log("data: ", data);
    currentDb[position].word = data.word;
    currentDb[position].grade = data.grade;
    return this.localStorage.setItem("lexicon_local", currentDb);
  }

  deleteWord(id: number) {
    let position = currentDb.map(word => word.id).indexOf(id);
    currentDb.splice(position, 1);
    // this.dbUpdated.next(true);
    dbSub.next(currentDb);
    return this.localStorage.setItem("lexicon_local", currentDb);
    // this.saveDb(currentDb);
  }

  checkDbStatus() {
    return this.dbUpdated.asObservable();
  }

  saveDb(db: Word[]) {
    localStorage.setItem("lexicon_local", JSON.stringify(db));
  }

  clearDb() {
    this.localStorage.clear().subscribe(res => {}, err => {});
  }
}
