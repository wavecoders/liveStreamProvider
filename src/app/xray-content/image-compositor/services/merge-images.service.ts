import { Injectable } from '@angular/core';
import { MergeImageOptions } from '../../models/merge-image-options';

@Injectable({
  providedIn: 'root'
})
export class MergeImagesService {

constructor() { }

  // Return Promise
  mergeImages(sources: any | string[], options?: any | MergeImageOptions) {

    // Defaults
    const defaultOptions = MergeImageOptions.adapt({})

    if ( sources === void 0 ) sources = []
    if ( options === void 0 ) options = {}

    return new Promise((resolve) => {
    options = { ...defaultOptions, ...options }

    // Setup browser/Node.js specific variables
    var canvas = options.Canvas ? new options.Canvas() : window.document.createElement('canvas')
    var Image = options.Image || window.Image

    // Load sources
    var images = sources.map((source: any) => { return new Promise((resolve, reject) => {
      // Convert sources to objects
      if (source.constructor.name !== 'Object') {
        source = { src: source }
      }

      // Resolve source and img when loaded
      var img = new Image()
      img.crossOrigin = options.crossOrigin

      img.onerror = () => { return reject(new Error('Couldn\'t load image')) }
      img.onload = () => { return resolve(Object.assign({}, source, { img: img })) }

      img.src = source.src

    }) })

    // Get canvas context
    var ctx = canvas.getContext('2d')

    // When sources have loaded
    resolve(
      Promise.all(images)
      .then((images) => {
        // Set canvas dimensions
        var getSize = (dim: any) => { return options[dim] || Math.max.apply(Math, images.map((image) => { return image[dim] })) }
        canvas.width = getSize('width')
        canvas.height = getSize('height')

        // Draw images to canvas
        images.forEach((image) => {
          ctx.globalAlpha = image.opacity ? image.opacity : 1
          return ctx.drawImage(image.img, image.x, image.y, image.width || 0, image.height || 0)
        })

        if (options.Canvas && options.format === 'image/jpeg') {
          // Resolve data URI for node-canvas jpeg async
          return new Promise((resolve, reject) => {
            canvas.toDataURL(options.format, {
              quality: options.quality,
              progressive: false
            }, (err: any, jpeg: any) => {
              if (err) {
                reject(err)
                return
              }
              resolve(jpeg)
            })
          })
        }

        // Resolve all other data URIs sync
        return canvas.toDataURL(options.format, options.quality)
      }))
    })
  }

  downloadImage(base64Image: any) {

      var link = document.createElement("a")

      document.body.appendChild(link)

      link.setAttribute("href", base64Image)
      link.setAttribute("download", "mrHankey.jpg")
      link.click()

  }

}
