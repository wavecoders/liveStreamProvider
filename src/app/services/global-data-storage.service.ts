
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UtilsService } from './utils.service';

  @Injectable({
    providedIn: 'root'
  })
  export class GlobalDataStorageService {

    private dataStore = new BehaviorSubject({})
    dataStore$ = this.dataStore.asObservable()

    settings: any = {}

    protected utilsService = inject(UtilsService)

    constructor() { }

    initDataStore(storeName: string) {
      const hasStore = this.loadStore(storeName)
      this.removeExpired(storeName)
      return hasStore
    }

    getSetting(storeName: string, setting: string) {

      try {

        if(!this.hasStore(storeName)) {
          const message = `No such Store '${storeName}' has been Initialized`
          throw new Error(message)
        }

        this.removeExpired(storeName, setting)
        return this.findSetting(storeName, setting)

      } catch(error) {
        return
      }

    }

    createSetting(storeName: string, setting: string, initialValue: any, options?: { expiresIn?: string, override?: boolean, create?: boolean }) {

      try {

        if(!this.hasStore(storeName)) {
          const message = `No such Store '${storeName}' has been Initialized`
          console.log(message)
        }

        this.removeExpired(storeName, setting)
        const foundSetting = this.findSetting(storeName, setting)

        if(foundSetting && !!(options?.override)) return false

        const expiresEpoch = this.expires(options?.expiresIn)

        if(expiresEpoch) {
          this.settings[storeName][setting] = { value: initialValue, expires: expiresEpoch }
        } else {
          this.settings[storeName][setting] = { value: initialValue }
        }

        this.updateStore(storeName)

      } catch(error) {

        if(options?.create) {
          this.createStore(storeName, options)
          this.createSetting(storeName, setting, initialValue, options)
        }

        return false

      }

      return true

    }

    updateSetting(storeName: string, setting: string, value: any, options?: { create?: boolean }) {

      try {

        if(!this.hasStore(storeName)) {
          const message = `No such Store '${storeName}' has been Initialized`
          throw new Error(message)
        }

        this.removeExpired(storeName, setting)
        const foundSetting = this.findSetting(storeName, setting)

        if(!foundSetting) {

          if(options?.create) {
            this.createSetting(storeName, setting, value)
          } else {
            const message = `No such Setting '${setting}' in Store ${storeName}`
            throw new Error(message)
          }

        }

        this.settings[storeName][setting] = { ...this.settings[storeName][setting], ...{ value } }
        this.updateStore(storeName)

      } catch(error) {
        console.log(error)
        return false
      }

      return true

    }

    removeSetting(storeName: string, setting: string) {

      try {

        if(!this.hasStore(storeName)) {
          const message = `No such Store '${storeName}' has been Initialized`
          throw new Error(message)
        }

        this.removeExpired(storeName, setting)
        const foundSetting = this.findSetting(storeName, setting)

        if(foundSetting) {
          delete this.settings[storeName][setting]
          this.updateStore(storeName)
          return true
        }

      } catch(error) {
        console.log(error)
        return false
      }

      return false

    }

    getExpiryTime(settingsObject: any) {

      if(this.hasExpiry(settingsObject)) {
        const timeRemaining = this.expiresIn(settingsObject.expires) || 0
        const hours = Math.floor(timeRemaining/60/60)
        const minutes = Math.floor(timeRemaining/60)
        return { hours: (hours < 1) ? 0 : hours, minutes: (minutes < 1) ? 0 : minutes }
      } else {
        return
      }

    }

    getExpiryDate(settingsObject: any, localDate?: boolean) {
      const date = (this.hasExpiry(settingsObject)) ? settingsObject.expires : undefined
      return (date) ? (localDate) ? new Date(date * 1000) : date : date
    }

    createStore(storeName: string, options?: { expiresIn?: string, override?: boolean }) {

      this.initDataStore(storeName)

      if(this.hasStore(storeName) && !(options?.override)) return

      this.settings[storeName] = {}

      if(options?.expiresIn) {
        const expiresIn = this.expires(options?.expiresIn)
        this.settings[storeName] = { ...this.settings[storeName], ...{ expires: expiresIn } }
      }

      sessionStorage.setItem(storeName,JSON.stringify(this.settings[storeName]))
      this.updateStore(storeName)

    }

    removeStore(storeName: string) {
      if(!this.hasStore(storeName)) return false
      delete this.settings[storeName]
      sessionStorage.removeItem(storeName)
      return true
    }

    clearStore(storeName: string) {
      if(!this.hasStore(storeName)) return false
      this.settings[storeName] = {}
      return true
    }

    private loadStore(storeName: string) {

      this.hasStore(storeName)
      const data = sessionStorage.getItem(storeName)
      const storeData = (data !== null) ? JSON.parse(data) : undefined

      if(!storeData) return false

      this.settings[storeName] = storeData
      this.dataStore.next(this.settings)

      return true
    }

    private removeExpired(storeName: string, setting?: string) {

      if(!this.hasStore(storeName)) return

      const expiryObj = (storeName && setting) ? this.settings[storeName][setting] : this.settings[storeName]

      if(this.hasExpiry(expiryObj)) {
        if(this.hasExpired(expiryObj.expires)) {

          if(storeName && setting) {
            delete this.settings[storeName][setting]
            this.updateStore(storeName)
            return true
          } else {
            this.removeStore(storeName)
            return true
          }

        }
      }

      return false

    }

    private hasStore(storeName: string) {
      return (this.settings[storeName]) ? true : false
    }

    private expires(str?: string) {

      if(!str) return
      const type = str.slice(-1)
      const now = Math.floor(new Date().getTime() / 1000)

      switch (type) {
        case
        'd':
          const days = parseInt(str.slice(0, -1))
          return now + (days * 86400)
        break;
        case
        'h':
          const hrs = parseInt(str.slice(0, -1))
          return now + (hrs * 3600)
        break;
        default:
          return
          break;
      }

    }

    private hasExpired(expiryDate: number) {
      if(!expiryDate) return
      const expires = this.expiresIn(expiryDate)
      return (expires! < 0) ? true : false
    }

    private hasExpiry(setting: any) {
      return (setting?.expires) ? true : false
    }

    private expiresIn(expiryDate: number) {
      if(!expiryDate) return
      const now = Math.floor(new Date().getTime() /1000)
      return expiryDate - now
    }

    private updateStore(storeName: string) {

      sessionStorage.setItem(storeName, JSON.stringify(this.settings[storeName]))

      setTimeout(() => {
        this.dataStore.next(this.settings)
      }, 500)
    }

    private findSetting(storeName: string, setting: string) {

      let foundSetting = this.utilsService.getValueByProp(this.settings[storeName], setting)

      if(foundSetting) {

        const isExpired = this.hasExpired(foundSetting?.expires)

        if(isExpired) {
          this.removeSetting(storeName, setting)
          return
        }

      }

      return foundSetting

    }

}
