import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';

import { ResultsDisplayComponent } from './results-display.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
  ],
  declarations: [
    ResultsDisplayComponent
  ],
  exports: [
    ResultsDisplayComponent
  ]
})
export class ResultsDisplayModule { }
