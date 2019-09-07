import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

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
  // displayedColumns: string[] = ["word", "grade", "edit", "delete"];
  displayedColumns: string[] = ["word", "grade", "buttons"];
  dataSource: MatTableDataSource<Word>;
  radioFilter = "all";
  localDb: Array<Word>;
  wordForDelete: Word;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild("deleteModal", { static: true }) deleteModal;

  constructor(private wordService: WordsService, public dialog: MatDialog) {}

  ngOnInit() {
    this.wordService.loadDb().subscribe(res => {
      this.localDb = res;
      this.generateTableData(this.localDb);
    });
    this.wordService.getDbObs().subscribe(res => {});
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
            res => {},
            err => {
              console.log(err);
            }
          );
        }
      },
      err => {
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
