import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageCompositorComponent } from './image-compositor.component';

import { MaterialModule } from './../../material.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
  ],
  declarations: [
    ImageCompositorComponent
  ],
  exports: [
    ImageCompositorComponent
  ]
})
export class ImageCompositorModule { }
