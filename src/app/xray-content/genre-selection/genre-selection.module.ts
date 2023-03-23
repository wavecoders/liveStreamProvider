import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './../../material.module';

import { GenreSelectionComponent } from './genre-selection.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
  ],
  declarations: [
    GenreSelectionComponent
  ],
  exports: [
    GenreSelectionComponent
  ]
})
export class GenreSelectionModule { }
