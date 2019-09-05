import { Component, OnInit } from '@angular/core';

import { CalcService } from './../../services/calc.service';

@Component({
  selector: "app-calculation",
  templateUrl: "./calculation.component.html",
  styleUrls: ["./calculation.component.css"]
})
export class CalculationComponent implements OnInit {
  text: string = "";
  file: File;
  arrayOfWords: Array<string>;

  constructor(private calcService: CalcService) {}

  ngOnInit() {}

  onFilePicked(e) {
    this.file = (event.target as HTMLInputElement).files[0];
    let reader = new FileReader();
    reader.onload = e => {
      this.makeCorrectArrayOfWords(e.target["result"]);
      // console.log("rezultati onload: ", e.target);
    };
    reader.readAsText(this.file);
    /* Ovde iskoristiti fileReader, nesto ovako:
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get("image").updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
     */
  }

  reset() {
    this.file = undefined;
    this.text = "";
  }

  makeCorrectArrayOfWords(words: string) {
    //regex which match all alphanumerics and spaces
    let regex = /[^A-Za-z0-9\s]/g;
    //regex which match / = + - and new lines
    let regexNewLine = /[\/\=\+\-\r?\n|\r]/g;
    this.arrayOfWords = words
      .toLowerCase()
      .replace(regexNewLine, " ")
      .replace(regex, "")
      .split(" ")
      .filter(word => word != "");
    console.log(
      "TCL: CalculationComponent -> makeCorrectArrayOfWords -> this.arrayOfWords",
      this.arrayOfWords
    );
  }

  analyze() {
    // let regex = /[.,]/g;
    // let regex = /[^A-Za-z0-9\s]/g;
    if (this.text && this.text !== "") {
      this.makeCorrectArrayOfWords(this.text);
    } else {
    }
    console.log(this.text);
    this.calcService.calculate(["nice", "excellent", "Ja"]);
  }
}
