
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  isString(x: string | number) {
    return Object.prototype.toString.call(x) === '[object String]'
  }

  isObject(obj: any) {
    return Object.prototype.toString.call(obj) === '[object Object]'
  }

  JSONToString(value: any) {
    return (this.isObject(value)) ? JSON.stringify(value) : value
  }

  stringToJSON(value: string) {
    return (this.isJSON(value)) ? JSON.parse(value) : value
  }

  isJSON(str: string) {
    try {
      JSON.parse(str)
    } catch (e) {
      return false
    }
    return true
  }

  getValueByProp(obj: any, prop: string) {
    if(typeof obj === 'undefined') return false
    return obj[prop]
  }

}
