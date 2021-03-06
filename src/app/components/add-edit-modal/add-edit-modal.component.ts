import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';
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
    public dialog: MatDialog,
    private _snackBar: MatSnackBar
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
        res => {
          this._snackBar.open("Edit was successful.", "OK", {
            duration: 5000,
            panelClass: ["correct-snackbar"]
          });
        },
        err => {
          this._snackBar.open("Problem ocurred, word wasn't updated.", "OK", {
            duration: 8000,
            panelClass: ["warning-snackbar"]
          });
          console.log(err);
        }
      );
    } else {
      this.wordService.addNewWord(word).subscribe(
        res => {
          this._snackBar.open("Word added successfully.", "OK", {
            duration: 5000,
            panelClass: ["correct-snackbar"]
          });
        },
        err => {
          this._snackBar.open("Problem ocurred, word wasn't added.", "OK", {
            duration: 8000,
            panelClass: ["warning-snackbar"]
          });
        }
      );
    }
    this.dialogRef.close(true);
  }
}
