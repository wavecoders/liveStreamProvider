import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';

import { CustomStreamingComponent } from './custom-streaming.component';
import { LiveContentSelectorComponent } from './live-content-selector/live-content-selector.component';
import { UserProfileManagerModule } from './user-profile-manager/user-profile-manager.module';
import { UpNextComponent } from './up-next/up-next.component';

import { ControlVolumeComponent } from './components/control-volume/control-volume.component';
import { ControlComponent } from './components/control/control.component';
import { ControlsComponent } from './components/controls/controls.component';
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';
import { TimeComponent } from './components/time/time.component';
import { VideoWrapperComponent } from './components/video-wrapper/video-wrapper.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    UserProfileManagerModule,
  ],
  declarations: [
    CustomStreamingComponent,
    LiveContentSelectorComponent,
    UpNextComponent,
    ControlsComponent,
    VideoWrapperComponent,
    ControlComponent,
    ProgressBarComponent,
    ControlVolumeComponent,
    TimeComponent,
  ],
  exports: [
    CustomStreamingComponent
  ]
})
export class CustomStreamingModule { }
