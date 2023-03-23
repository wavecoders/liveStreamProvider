import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-results-display',
  templateUrl: './results-display.component.html',
  styleUrls: ['./results-display.component.css']
})
export class ResultsDisplayComponent implements OnInit {

  @Input() resultsData = {}

  keys = (data: any) => Object.keys(data)
  values = (data: any) => Object.values(data)

  constructor() { }

  ngOnInit() {
  }

}
