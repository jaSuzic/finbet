import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatPaginator, MatSnackBar, MatSort, MatTableDataSource } from '@angular/material';

import { Word } from './../../models/word.model';
import { WordsService } from './../../services/words.service';
import { AddEditModalComponent } from './../add-edit-modal/add-edit-modal.component';

@Component({
  selector: "app-lexicon",
  templateUrl: "./lexicon.component.html",
  styleUrls: ["./lexicon.component.css"],
  encapsulation: ViewEncapsulation.None
})
export class LexiconComponent implements OnInit {
  displayedColumns: string[] = ["word", "grade", "buttons"];
  dataSource: MatTableDataSource<Word>;
  radioFilter = "all";
  localDb: Array<Word>;
  wordForDelete: Word;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild("deleteModal", { static: false }) deleteModal;

  constructor(
    private wordService: WordsService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.wordService.loadDb().subscribe(res => {
      this.localDb = res;
      this.generateTableData(this.localDb);
      this.radioFilter = "all";
    });
  }

  filterWords(filterValue) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  generateTableData(source) {
    this.dataSource = new MatTableDataSource(source);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  openEditModal(selectedItem) {
    let dialogRef = this.dialog.open(AddEditModalComponent, {
      width: "450px",
      data: {
        edit: true,
        ...selectedItem
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.radioFilter = "all";
        this.generateTableData(this.localDb);
      }
    });
  }

  confirmDelete(selectedWord) {
    this.wordForDelete = selectedWord;
    let dialogRef = this.dialog.open(this.deleteModal, {
      width: "350px",
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(
      res => {
        if (res) {
          this.wordService.deleteWord(selectedWord.id).subscribe(
            res => {
              this._snackBar.open("Word deleted.", "OK", {
                duration: 5000,
                panelClass: ["correct-snackbar"]
              });
              this.radioFilter = "all";
            },
            err => {
              this._snackBar.open(
                "Problem ocurred, word wasn't deleted.",
                "OK",
                {
                  duration: 8000,
                  panelClass: ["warning-snackbar"]
                }
              );
              console.log(err);
            }
          );
        }
      },
      err => {
        this._snackBar.open("Problem ocurred, word wasn't deleted.", "OK", {
          duration: 8000,
          panelClass: ["warning-snackbar"]
        });
        console.log(err);
      }
    );
  }

  openAddNewModal() {
    let dialogRef = this.dialog.open(AddEditModalComponent, {
      width: "450px",
      data: {
        edit: false
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.radioFilter = "all";
        this.generateTableData(this.localDb);
      }
    });
  }

  onRadioChange(e) {
    let filteredData: Array<Word>;
    if (e.value === "negative") {
      filteredData = this.localDb.filter(word => word.grade < 0);
    } else if (e.value === "positive") {
      filteredData = this.localDb.filter(word => word.grade > 0);
    } else {
      filteredData = this.localDb;
    }
    this.generateTableData(filteredData);
  }
}
