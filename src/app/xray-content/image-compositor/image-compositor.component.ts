import { Component, ElementRef, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { MergeImagesService } from './services/merge-images.service';

export type NgChanges<Component extends object, Props = ExcludeFunctions<Component>> = {
  [Key in keyof Props]: {
    previousValue: Props[Key];
    currentValue: Props[Key];
    firstChange: boolean;
    isFirstChange(): boolean;
  }
}

type MarkFunctionPropertyNames<Component> = {
  [Key in keyof Component]: Component[Key] extends Function | Subject<any> ? never : Key;
}
type Example = MarkFunctionPropertyNames<{ posterImage: string, posterTitle: string }>;

type ExcludeFunctionPropertyNames<T extends object> = MarkFunctionPropertyNames<T>[keyof T];
type Example2 = ExcludeFunctionPropertyNames<{ posterImage: string, posterTitle: string }>;

type ExcludeFunctions<T extends object> = Pick<T, ExcludeFunctionPropertyNames<T>>;
type Example3 = ExcludeFunctions<{ posterImage: string, posterTitle: string }>;

@Component({
  selector: 'app-image-compositor',
  templateUrl: './image-compositor.component.html',
  styleUrls: ['./image-compositor.component.css']
})
export class ImageCompositorComponent implements OnInit {

  @ViewChild('posterImagePosition', { static: false }) posterImagePosition!: ElementRef
  @ViewChild('titleImagePosition', { static: false }) titleImagePosition!: ElementRef

  _posterImage = ''
  @Input() set posterImage(value: string) {
    this._posterImage = value
  }

  get posterImage() {
    return this._posterImage
  }

  _posterTitle = ''
  @Input() set posterTitle(value: string) {
    this._posterTitle = value
  }

  get posterTitle() {
    return this._posterTitle
  }

  constructor(
    private mergeImagesService: MergeImagesService,
  ) { }

  ngOnInit() {
  }

  ngOnChanges(changes: NgChanges<{ posterImage: string, posterTitle: string }>) {

    this.posterImage = (changes.posterImage) ? changes.posterImage.currentValue : this.posterImage
    this.posterTitle = (changes.posterTitle) ? changes.posterTitle.currentValue : this.posterTitle

  }

    // IMAGE COMPOSITOR
    onDownloadPoster() {
      this.composeImage(this.posterImage, this.posterTitle)
    }

    composeImage(titleImage: string, poserImage: string) {

      const poster = this.posterImagePosition.nativeElement
      const logo = this.titleImagePosition.nativeElement

      const imagePoster = {
        image: poster.currentSrc,
        width: poster.offsetWidth,
        height: poster.offsetHeight,
        x: poster.x, y: poster.y
      }
      const imageLogo = {
        image: logo.currentSrc,
        width: logo.offsetWidth,
        height: logo.offsetHeight,
        x: logo.x, y: logo.y
      }

      this.mergeImagesService.mergeImages([
        { src: imagePoster.image, width: imagePoster.width, height: imagePoster.height, x: imagePoster.x, y: imagePoster.y },
        { src: imageLogo.image, width: imageLogo.width, height: imageLogo.height, x: imageLogo.x, y: imageLogo.y - imageLogo.height },
      ])
      .then((b64: any) => this.mergeImagesService.downloadImage(b64))

    }

}
