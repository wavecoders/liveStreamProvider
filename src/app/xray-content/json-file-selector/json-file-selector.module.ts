import { MaterialModule } from '../../material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JsonFileSelectorComponent } from './json-file-selector.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
  ],
  declarations: [
    JsonFileSelectorComponent
  ],
  exports:[
    JsonFileSelectorComponent
  ]
})
export class JsonFileSelectorModule { }
