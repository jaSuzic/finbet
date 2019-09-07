import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { Word } from 'src/app/models/word.model';
import { WordsService } from 'src/app/services/words.service';

@Component({
  selector: "app-add-edit-modal",
  templateUrl: "./add-edit-modal.component.html",
  styleUrls: ["./add-edit-modal.component.css"]
})
export class AddEditModalComponent implements OnInit {
  editForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AddEditModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private wordService: WordsService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.editForm = new FormGroup({
      word: new FormControl(this.data.word, Validators.required),
      grade: new FormControl(this.data.grade, [
        Validators.required,
        Validators.min(-1),
        Validators.max(1)
      ])
    });
  }

  save() {
    //just in case if user change html disabled value next line won't allow adding wrong values
    if (this.editForm.invalid) return;
    let word = new Word();
    word.word = this.editForm.value.word;
    word.grade = this.editForm.value.grade;
    if (this.data.edit) {
      word.id = this.data.id;
      this.wordService.updateWord(word).subscribe(
        res => {},
        err => {
          console.log(err);
        }
      );
    } else {
      this.wordService.addNewWord(word).subscribe(res => {});
    }
    this.dialogRef.close();
  }
}
