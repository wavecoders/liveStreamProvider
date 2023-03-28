import { MaterialModule } from 'src/app/material.module';
import { LoginModule } from './login/login.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule } from '@angular/common/http';
import { XRAYContentFindersModule } from './xray-content/xray-content-finder.module';

import { CustomStreamingModule } from './custom-streaming/custom-streaming.module';
import { LiveStreamingModule } from './live-streaming/live-streaming.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    XRAYContentFindersModule,
    LoginModule,
    MaterialModule,
    CustomStreamingModule,
    LiveStreamingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
