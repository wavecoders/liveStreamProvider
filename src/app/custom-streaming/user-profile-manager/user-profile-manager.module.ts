import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfileManagerComponent } from './user-profile-manager.component';
import { MaterialModule } from '../../material.module';
import { UserProfileComponent } from '../user-profile/user-profile.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
  ],
  declarations: [
    UserProfileManagerComponent,
    UserProfileComponent,
  ],
  exports: [
    UserProfileManagerComponent
  ]
})
export class UserProfileManagerModule { }
