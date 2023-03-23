import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-genre-selection',
  templateUrl: './genre-selection.component.html',
  styleUrls: ['./genre-selection.component.css']
})
export class GenreSelectionComponent implements OnInit {

  @Output() seclected = new EventEmitter()

  @Input() sections: any
  @Input() min = 0

  orderAmount = (objs: any[]) => objs.sort((a,b) => (b.percent - a.percent))

  constructor() { }

  ngOnInit() {
  }

  onMore(object: any) {
    object.percent = object.percent+= 10
    if(object.percent < this.min) object.percent = this.min
    object.percent = (object.percent > 100) ? 100 : object.percent
  }

  onLess(object: any) {
    object.percent = object.percent-= 10
    object.percent = (object.percent <= this.min) ? 0 : object.percent
  }

  drop(event: CdkDragDrop<string[]>) {
    this.sections[event.previousIndex].percent = this.sections[event.currentIndex].percent
    moveItemInArray(this.sections, event.previousIndex, event.currentIndex)
    this.seclected.emit(this.sections)
  }

  onOrdergenre() {
    this.orderAmount(this.sections)
    this.seclected.emit(this.sections)
  }

}
