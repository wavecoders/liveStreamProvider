import { Component, OnInit, ViewChild } from '@angular/core';

import { XRAYContentFinderComponent } from './xray-content/xray-content-finder.component';
import { CustomStreamingComponent } from './custom-streaming/custom-streaming.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  @ViewChild('xray', { static: false }) xray!: XRAYContentFinderComponent
  @ViewChild('stream', { static: false }) stream!: CustomStreamingComponent

  isLoggedIn = false

  constructor() {}

  ngOnInit() {

  }

  onLoggedIn(state: boolean) {
    this.isLoggedIn = state
    if(!state) this.xray?.reset()
    if(!state) this.stream?.reset()
  }

}
