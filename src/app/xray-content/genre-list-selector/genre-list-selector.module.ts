import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';

import { GenreListSelectorComponent } from './genre-list-selector.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
  ],
  declarations: [
    GenreListSelectorComponent
  ],
  exports: [
    GenreListSelectorComponent
  ]
})
export class GenreListSelectorModule { }
