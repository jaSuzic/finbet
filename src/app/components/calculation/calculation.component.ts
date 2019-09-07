import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';

import { CalcService } from './../../services/calc.service';

@Component({
  selector: "app-calculation",
  templateUrl: "./calculation.component.html",
  styleUrls: ["./calculation.component.css"]
})
export class CalculationComponent implements OnInit {
  @ViewChild("filePicker", { static: true }) filePicker: ElementRef;
  @ViewChild("warning", { static: true }) warningModal;
  text: string = "";
  file: File;
  arrayOfWords: Array<string>;
  result: number;
  resultText: string;

  constructor(private calcService: CalcService, public dialog: MatDialog) {}

  ngOnInit() {}

  onFilePicked(e) {
    this.file = (event.target as HTMLInputElement).files[0];
    if (this.file.type !== "text/plain") {
      this.file = undefined;
      let dialogRef = this.dialog.open(this.warningModal, {
        width: "350px"
      });
      return;
    }
    let reader = new FileReader();
    reader.onload = e => {
      this.makeCorrectArrayOfWords(e.target["result"] as string);
    };
    reader.readAsText(this.file);
  }

  reset() {
    this.file = undefined;
    this.text = "";
    this.filePicker.nativeElement.value = null;
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
  }

  analyze(templateRef) {
    if (this.text && this.text !== "") {
      this.makeCorrectArrayOfWords(this.text);
    }
    this.result = this.calcService.calculate(this.arrayOfWords);
    let dialogRef = this.dialog.open(templateRef, {
      width: "350px"
    });
    if (this.result > 0) this.resultText = "positive";
    else if (this.result < 0) this.resultText = "negative";
    else this.resultText = "neutral";
  }
}
