import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

import { Word } from './../../models/word.model';
import { WordsService } from './../../services/words.service';
import { AddEditModalComponent } from './../add-edit-modal/add-edit-modal.component';

@Component({
  selector: "app-lexicon",
  templateUrl: "./lexicon.component.html",
  styleUrls: ["./lexicon.component.css"]
})
export class LexiconComponent implements OnInit {
  displayedColumns: string[] = ["word", "grade", "edit", "delete"];
  dataSource: MatTableDataSource<Word>;
  radioFilter = "all";
  localDb: Array<Word>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private wordService: WordsService, public dialog: MatDialog) {}

  ngOnInit() {
    this.wordService.loadDb().subscribe(res => {
      console.log("res u initu: ", res);
      this.localDb = res;
      this.generateTableData(this.localDb);
    });
    // this.wordService.checkDbStatus().subscribe(res => {
    //   let updatedDb = this.wordService.getCurrentDb();
    //   this.generateTableData(updatedDb);
    // });
    this.wordService.getDbObs().subscribe(res => {
      console.log("TCL: LexiconComponent -> Sub na promenu -> res", res);
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
      }
    });
  }

  confirmDelete(selectedWord) {
    if (
      confirm(
        "Are you sure you want to delete word: " + selectedWord.word + "?"
      )
    ) {
      this.wordService
        .deleteWord(selectedWord.id)
        .subscribe(res => {}, err => {});
    }
  }

  openAddNewModal() {
    let dialogRef = this.dialog.open(AddEditModalComponent, {
      width: "450px",
      data: {
        edit: false
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
    console.log("filtered data: ", filteredData);
    this.generateTableData(filteredData);
    console.log(e.value);
  }

  //this should be removed
  clear() {
    this.wordService.clearDb();
  }
}
