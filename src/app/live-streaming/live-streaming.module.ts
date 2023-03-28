import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LiveStreamingComponent } from './live-streaming.component';
import { MaterialModule } from '../material.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
  ],
  declarations: [
    LiveStreamingComponent
  ],
  exports: [
    LiveStreamingComponent
  ]
})
export class LiveStreamingModule { }
