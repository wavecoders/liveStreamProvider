import { ChangeDetectionStrategy, Component, Input, OnInit, Output } from '@angular/core';
import { LiveContentService } from '../services/live-content.service';

@Component({
  selector: 'app-live-content-selector',
  templateUrl: './live-content-selector.component.html',
  styleUrls: ['./live-content-selector.component.css'],
})
export class LiveContentSelectorComponent implements OnInit {

  baseAssets = "/assets/images"
  upnext = false

  _poster?: string
  @Input() set poster(image: string | unknown) {
    this._poster = `${this.baseAssets}/${image}`
  }

  get poster() {
    return this._poster
  }

  _image?: string
  @Input() set image(image: string | unknown) {
    this._image = `${this.baseAssets}/${image}`
  }

  get image() {
    return this._image
  }

  @Input() details = { title: '', description: '' }

  private _time = 0
  @Input() set time(value : number) {
    this._time = value
  }

  get time() {
    return this._time
  }

  constructor(
    private liveContentService: LiveContentService
  ) { }

  ngOnInit() {
  }

  onUpNext() {
    this.upnext = !this.upnext
  }

  timeRemaining(time: any) {
    const now = Math.floor(new Date().getTime() / 1000)
    const remaining = new Date((time - now) * 1000).getMinutes()
    if(remaining < 0) this.liveContentService.contentChanged.next(true)
    return remaining
  }

}
