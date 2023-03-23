import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { XrayFileSelectorComponent } from './xray-file-selector.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    XrayFileSelectorComponent
  ],
  exports: [
    XrayFileSelectorComponent
  ]
})
export class XrayFileSelectorModule { }
