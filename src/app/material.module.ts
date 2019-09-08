import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  MatCardModule,
  MatDialogModule,
  MatDividerModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatPaginatorModule,
  MatRadioModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatTooltipModule,
} from '@angular/material';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AddEditModalComponent } from './components/add-edit-modal/add-edit-modal.component';

const modules = [
  BrowserAnimationsModule,
  MatButtonModule,
  MatTabsModule,
  MatTableModule,
  MatFormFieldModule,
  MatPaginatorModule,
  MatInputModule,
  MatCardModule,
  MatDialogModule,
  MatDividerModule,
  MatRadioModule,
  MatIconModule,
  MatTooltipModule,
  MatSortModule,
  MatSnackBarModule
];

@NgModule({
  declarations: [],
  imports: [CommonModule, ...modules],
  exports: [...modules],
  entryComponents: [AddEditModalComponent]
})
export class MaterialModule {}
