import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent {
  @Input() public max?: number;
  @Input() public value?: number;
  @Input() public label?: string;
  @Output() public input = new EventEmitter<any>();
  @Output() public change = new EventEmitter<any>();

  public inputHandler(event: any) {
    this.input.emit(event);
  }

  public changeHandler(event: any) {
    this.change.emit(event);
  }
}
