import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './../../material.module';
import { LandmarkSelectionComponent } from './landmark-selection.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
  ],
  declarations: [
    LandmarkSelectionComponent
  ],
  exports: [
    LandmarkSelectionComponent
  ]
})
export class LandmarkSelectionModule { }
