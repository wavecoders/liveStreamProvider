import { ElementRef, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ColorGrabberService {

  backgroundColor$ = new BehaviorSubject('')
  textColor$ = new BehaviorSubject('')

  ctx!: CanvasRenderingContext2D

  constructor() { }

  reset() {
    this.getColorFromImage('')
  }

  getColorFromImage(imageUrl: string, light = '#FFFFFF', dark = '#000000') {

    const canvas = document.createElement('canvas')
    canvas.width = 1
    canvas.height = 1

    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D

    this.imgLoad(imageUrl).then((data: any) => {

        const img = this.blobToImage(data).then((img: any) => {

          this.ctx.drawImage(img, 0, 0, 1, 1)
          const i = this.ctx.getImageData(0, 0, 1, 1).data

          const rgbColor = `rgba(${i[0]},${i[1]},${i[2]},${i[3]})`
          const hexColor = "#" + ((1 << 24) + (i[0] << 16) + (i[1] << 8) + i[2]).toString(16).slice(1)

          const textColor = this.textColorBasedOnBgColor(hexColor, light, dark)

          const hsv= this.RGB2HSV({ r: i[0], g: i[1], b: i[2] })
          hsv.hue = this.HueShift(hsv.hue, 135.0)

          const secondaryColor = this.HSV2RGB(hsv)
          const highlightColor = this.lightenDarkenColor(secondaryColor.hex, 50)

          this.backgroundColor$.next(rgbColor)
          this.textColor$.next(textColor)
          console.log(rgbColor)

        })

    })

  }


  blobToImage(blob: any) {
    return new Promise(resolve => {
      const url = URL.createObjectURL(blob)
      let img = new Image()
      img.onload = () => {
        URL.revokeObjectURL(url)
        resolve(img)
      }
      img.src = url
    })
  }

  imgLoad(url: string) {
    return new Promise(function (resolve, reject) {
        var request = new XMLHttpRequest();
        request.open('GET', url);
        request.responseType = 'blob';

        request.onload = function () {
            if (request.status === 200) {
                resolve(request.response);
            } else {
                reject(new Error('Image didn\'t load successfully; error code:' + request.statusText));
            }
        };

        request.onerror = function () {
            reject(new Error('There was a network error.'));
        };

        request.send();
    });
  }

  textColorBasedOnBgColor(
    bgColor: string,
    lightColor: string = '#FFFFFF',
    darkColor: string = '#000000'
    ) {

    const color = (bgColor.charAt(0) === '#') ? bgColor.substring(1, 7) : bgColor

    const r = parseInt(color.substring(0, 2), 16) // hexToR
    const g = parseInt(color.substring(2, 4), 16) // hexToG
    const b = parseInt(color.substring(4, 6), 16) // hexToB

    const uicolors = [r / 255, g / 255, b / 255]

    const c = uicolors.map((col) => {

      if (col <= 0.03928) return col / 12.92
      return Math.pow((col + 0.055) / 1.055, 2.4)

    })

    const L = (0.2126 * c[0]) + (0.7152 * c[1]) + (0.0722 * c[2])

    return (L > 0.179) ? darkColor : lightColor

  }

  RGB2HSV(rgb: { r: any, g: any, b: any}) {

    const hsv = { saturation:0, hue:0, value: 0 }

    const max = this.max3(rgb.r,rgb.g,rgb.b)
    const dif = max - this.min3(rgb.r,rgb.g,rgb.b)
    hsv.saturation = (max==0.0)?0:(100*dif/max)

    if (hsv.saturation == 0) {
      hsv.hue=0
    } else if (rgb.r == max) {
      hsv.hue=60.0*(rgb.g-rgb.b)/dif
    } else if (rgb.g == max) {
      hsv.hue=120.0+60.0*(rgb.b-rgb.r)/dif
    } else if (rgb.b == max) {
      hsv.hue=240.0+60.0*(rgb.r-rgb.g)/dif
    }

    if (hsv.hue<0.0) hsv.hue+=360.0

    hsv.value = Math.round(max*100/255)
    hsv.hue = Math.round(hsv.hue)
    hsv.saturation = Math.round(hsv.saturation)

    return hsv
  }

  HSV2RGB(hsv: any) {

    const rgb = { r: 0, g: 0, b: 0}

    if (hsv.saturation==0) {
      rgb.r = rgb.g = rgb.b = Math.round(hsv.value*2.55)
    } else {

      hsv.hue/=60
      hsv.saturation/=100
      hsv.value/=100
      const i = Math.floor(hsv.hue)
      const f = hsv.hue-i

      const p = hsv.value*(1-hsv.saturation)
      const q = hsv.value*(1-hsv.saturation*f)
      const t = hsv.value*(1-hsv.saturation*(1-f))

      switch(i) {

      case 0: rgb.r=hsv.value; rgb.g=t; rgb.b=p; break
      case 1: rgb.r=q; rgb.g=hsv.value; rgb.b=p; break
      case 2: rgb.r=p; rgb.g=hsv.value; rgb.b=t; break
      case 3: rgb.r=p; rgb.g=q; rgb.b=hsv.value; break
      case 4: rgb.r=t; rgb.g=p; rgb.b=hsv.value; break

      default: rgb.r=hsv.value; rgb.g=p; rgb.b=q

      }

      rgb.r = Math.round(rgb.r*255)
      rgb.g = Math.round(rgb.g*255)
      rgb.b = Math.round(rgb.b*255)

    }

    const rgbColor = `rgba(${rgb.r},${rgb.g},${rgb.b},${1})`
    const hexColor = "#" + ((1 << 24) + (rgb.r << 16) + (rgb.g << 8) + rgb.b).toString(16).slice(1)

    return { rgb: rgbColor, hex: hexColor }
  }

  HueShift(h: any, s: any) {
    h += s
    while (h>=360.0) h-=360.0
    while (h<0.0) h+=360.0
    return h
  }

  min3(a: any, b: any, c: any) {
    return (a<b)?((a<c)?a:c):((b<c)?b:c)
  }

  max3(a: any, b: any, c: any) {
    return (a>b)?((a>c)?a:c):((b>c)?b:c)
  }

  lightenDarkenColor(colorCode: any, amount: number) {

    var usePound = false;

    if (colorCode[0] == "#") {
        colorCode = colorCode.slice(1);
        usePound = true;
    }

    var num = parseInt(colorCode, 16);

    var r = (num >> 16) + amount;

    if (r > 255) {
        r = 255;
    } else if (r < 0) {
        r = 0;
    }

    var b = ((num >> 8) & 0x00FF) + amount;

    if (b > 255) {
        b = 255;
    } else if (b < 0) {
        b = 0;
    }

    var g = (num & 0x0000FF) + amount;

    if (g > 255) {
        g = 255;
    } else if (g < 0) {
        g = 0;
    }

    return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16)

  }

}
