import { FormBuilder } from '@angular/forms';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-landmark-selection',
  templateUrl: './landmark-selection.component.html',
  styleUrls: ['./landmark-selection.component.css']
})
export class LandmarkSelectionComponent implements OnInit {

  @Input() section = []

  @Input() icon?: string
  @Output() selected = new EventEmitter()

  selectedForm = this.fb.control([])

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.selectedForm.valueChanges.subscribe(data => {
      this.selected.emit(data)
    })
  }

}
