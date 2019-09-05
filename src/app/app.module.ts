import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddEditModalComponent } from './components/add-edit-modal/add-edit-modal.component';
import { CalculationComponent } from './components/calculation/calculation.component';
import { LexiconComponent } from './components/lexicon/lexicon.component';
import { MainComponent } from './components/main/main.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { MaterialModule } from './material.module';
import { WordsService } from './services/words.service';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    NotFoundComponent,
    LexiconComponent,
    CalculationComponent,
    AddEditModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [WordsService],
  bootstrap: [AppComponent]
})
export class AppModule {}
