import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { GenreListData } from './genre-list.model';

@Component({
  selector: 'app-genre-list-selector',
  templateUrl: './genre-list-selector.component.html',
  styleUrls: ['./genre-list-selector.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: GenreListSelectorComponent,
    multi: true
  }]
})
export class GenreListSelectorComponent implements OnInit, ControlValueAccessor {

  @Input() currentItems: GenreListData[] = []
  currentItemsSorted: GenreListData[] = []

  @Output() changed = new EventEmitter()
  @Output() changedOnClose = new EventEmitter()

  @Input() step = 10

  _min = 0
  @Input() set min(value: number) {
    this._min = value
  }

  get min() {
    return this._min
  }

  _max = 100
  @Input() set max(value: number) {
    this._max = value
  }

  get max() {
    return this._max
  }

  onChange = (value: GenreListData[]) => {}
  onTouched = () => {}

  constructor() { }

  writeValue(value: GenreListData[]) {
    this.currentItems = value
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {

  }

  ngOnInit() {
    this.updateSorted()
  }

  onIncrease(item: GenreListData) {
    item.percent += this.step
    if(item.percent < this.min) item.percent = this.min
    item.percent = (item.percent > 100) ? 100 : item.percent
    this.update(this.currentItems)
  }

  onDecrease(item: GenreListData) {
    item.percent -= this.step
    item.percent = (item.percent <= this.min) ? 0 : item.percent
    this.update(this.currentItems)
  }

  update(data: GenreListData[]) {
    this.onChange(data)
    this.changed.emit(data)
  }

  onClosedMenu() {
    this.changedOnClose.emit(this.currentItems)
  }

  updateSorted() {
    this.currentItemsSorted = this.currentItems.sort((a,b) => (a.percent < b.percent) ? 1 : (a.percent > b.percent) ? -1 : 0)
  }

}
