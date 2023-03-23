import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './../../material.module';
import { MicroSelectionComponent } from './micro-selection.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
  ],
  declarations: [
    MicroSelectionComponent
  ],
  exports: [
    MicroSelectionComponent
  ]
})
export class MicroSelectionModule { }
