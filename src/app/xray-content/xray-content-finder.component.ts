import { XrayData } from './json-file-selector/xray-data.model';
import { EMPTY, map, Observable, of, tap } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
// import { NgxCsvParser, NgxCSVParserError } from 'ngx-csv-parser';
import { CrudService } from '../http-service/services/crud.service';
import { environment } from 'src/environments/enviroment';
import { HttpClient } from '@angular/common/http';
import { MovieShowData } from './models/movie-show-data.model';

import { ColorGrabberService } from './services/color-grab-.service';

// API Key (v3 auth)
// a3f2e42dae8d5d814d9757db0490eb32

// Example API Request
// https://api.themoviedb.org/3/movie/550?api_key=a3f2e42dae8d5d814d9757db0490eb32
// API Read Access Token (v4 auth)

// image path - https://image.tmdb.org/t/p/w500/
// server - https://api.themoviedb.org/3/search/person?api_key=a3f2e42dae8d5d814d9757db0490eb32
// https://api.themoviedb.org/3/search/person?api_key=a3f2e42dae8d5d814d9757db0490eb32&query=Neha Shetty

// results.profile_path - "/ssnhVKI76uzArwuZv8F9XMO9NGO.jpg"

@Component({
  selector: 'app-xray-content-finder',
  templateUrl: './xray-content-finder.component.html',
  styleUrls: ['./xray-content-finder.component.css']
})
export class XRAYContentFinderComponent extends CrudService<any> implements OnInit {

  _isLoggedIn = false
  @Input() set isLoggedIn(value: boolean) {
     this._isLoggedIn = value
  }
  get isLoggedIn() {
    return this._isLoggedIn
  }

  @ViewChild('posterImage', { static: false }) posterImage!: ElementRef
  @ViewChild('titleImage', { static: false }) titleImage!: ElementRef

  details = this.fb.group({})

  searchCriteria: any = {}
  searchMicroCriteria: any = {}

  buffer = .1

  sections: any
  selected!: string

  @ViewChild('fileImportInput') fileImportInput: any;
  fileAttr = 'Choose File';

  fileData: { name: string, data: any[]} = {
    name: '',
    data: []
  }

  generalInfo$!: Observable<any>

  records: any = {}
  header: boolean = false;

  reference: any = []

  person: any
  results?: any[]

  backgroundColor$!: Observable<string>
  textColor$!: Observable<string>

  castControl = this.fb.control<string[]>([])

  resultDetails = {}
  resultDetailsFound: {
    cast: any[], genre: any[], action: any[], micro: any[], landmark: any[]
  } = {
    cast:[], genre:[], action:[], micro:[], landmark:[]
  }

  constructor(
    private fb: FormBuilder,
    // private ngxCsvParser: NgxCsvParser,
    private colorGrabberService: ColorGrabberService,
  ) {
    super(environment.api)
  }

  ngOnInit() {

    this.backgroundColor$ = this.colorGrabberService.backgroundColor$
    this.textColor$ = this.colorGrabberService.textColor$

    this.castControl.valueChanges.subscribe((data: any) => {

      this.searchCriteria.cast = data.map((item: string) => {
        const values = this.fileData.data.map((rec: any) => parseFloat(rec[item]))
        const max = Math.max(...values) * 100
        return  { name: item, percent: max }

      })

      this.findData()

    })

  }

  parseSubjectsJson(jsonData: any[]) {

    const data = (jsonData.length > 0 ) ? jsonData : []

    const rec = data[0]

    let dataSet = {}

    const dataSets = Object.keys(rec)

    dataSets.map(item => {

      const keys = Object.keys(rec[item])

      if(item === 'Genre') {

        const ranges = keys.map(key => {
          return { name: key, percent: 0 }
        })

        dataSet = { ...dataSet, ...{ [item.toLowerCase()]: ranges } }

      }

      if(item !== 'Frame' && item !== 'Clips' && item !== 'Genre') {
        dataSet = { ...dataSet, ...{ [item.toLowerCase()]: keys } }
      }

    })

    return dataSet

  }

  imagePath = (fileName: string) => `assets/{{fileName}}.png`

  reset() {

    this.results = undefined

    this.colorGrabberService.reset()
    this.backgroundColor$ = of('#FFFFFF')
    this.textColor$ = of('#000000')

  }

  findData() {

    const searchCast = this.searchCriteria.cast.map((item: any) => {
      return { [item.name] : item.percent/100 }
    })

    const searchGenre = this.searchCriteria.genre.map((item: any) => {
      return { [item.name] : item.percent/100 }
    }).filter((item: any) => {
      return ((Object.values(item)[0]) as number > 0)
    })

    const searchAction = (this.searchCriteria.action) ?this.searchCriteria?.action.map((item: any) => { return { [item] : .9 } }) : {}
    const searchMicro = (this.searchCriteria.micro_genre) ? this.searchCriteria.micro_genre.map((item: any) => { return { [item] : .99 } }) : {}
    const searchLandmark = (this.searchCriteria.landmark) ? this.searchCriteria.landmark.map((item: any) => { return { [item] : .99 } }) : {}

    const searchCredits = (this.searchCriteria.credits) ? this.searchCriteria.credits.map((item: any) => { return { [item] : .99 } }) : {}

    const resultSummary: any = {
      cast: [],
      genre: [],
      action: [],
      micro: [],
      landmark: [],
      credits: []
    }

    // CAST
    const data = [ ...this.fileData.data ]
    resultSummary.cast = this.filterData(data, searchCast, .99)

    const resultCast = this.filterData(this.fileData.data, searchCast, .99)
    const resultCastF = (resultCast.length > 0) ? resultCast : this.fileData.data

    const cast = searchCast.map((item: any) => Object.keys(item)).flat(1)
    if(searchCast.length > 0) resultCastF.sort(this.dynamicSortMultiple(cast)).reverse()

    // GENRE
    resultSummary.genre = this.filterData(resultCastF, searchGenre, .99)

    const resultGenre = this.filterData(resultCastF, searchGenre, .95)
    const resultGenreF = (resultGenre.length > 0) ? resultGenre : resultCastF

    const genre = searchGenre.map((item: any) => Object.keys(item)).flat(1)
    if(searchGenre.length > 0) resultGenreF.sort(this.dynamicSortMultiple(genre)).reverse()

    // MICRO GENRE
    resultSummary.action = this.filterData(resultGenreF, searchAction, .97)

    const resultAction = this.filterData(resultGenreF, searchAction, .97)
    const resultActionF = (resultAction.length > 0) ? resultAction : resultGenreF

    const action = searchAction.map((item: any) => Object.keys(item)).flat(1)
    if(searchAction.length > 0) resultActionF.sort(this.dynamicSortMultiple(action)).reverse()
    //-----------------------------------------------------------------------
    resultSummary.micro = this.filterData(resultActionF, searchMicro, .97)

    const resultMico = this.filterData(resultAction, searchMicro, .97)
    const resultMicoF = (resultMico.length > 0) ? resultMico : resultActionF

    const micro = searchMicro.map((item: any) => Object.keys(item)).flat(1)
    if(searchMicro.length > 0) resultMicoF.sort(this.dynamicSortMultiple(micro)).reverse()
    //-----------------------------------------------------------------------
    resultSummary.landmark = this.filterData(resultMicoF, searchLandmark, .97)

    const resultLandmark = this.filterData(resultMico, searchLandmark, .97)
    const resultLandmarkF = (resultLandmark.length > 0) ? resultLandmark : resultMicoF

    const landmark = searchLandmark.map((item: any) => Object.keys(item)).flat(1)
    if(searchLandmark.length > 0) resultLandmarkF.sort(this.dynamicSortMultiple(landmark)).reverse()
    //-----------------------------------------------------------------------
    resultSummary.credits = this.filterData(resultLandmarkF, searchCredits, .98)

    const resultCredits = this.filterData(resultLandmark, searchCredits, .98)
    const resultCreditsF = (resultCredits.length > 0) ? resultCredits : resultLandmarkF

    const credits = searchCredits.map((item: any) => Object.keys(item)).flat(1)
    // if(searchCredits.length > 0) resultCreditsF.sort(this.dynamicSortMultiple(credits)).reverse()

    this.results = [...resultGenre, ...resultAction, ...resultMico, ...resultLandmark, ...credits]

    this.resultDetails = {
      cast: resultSummary.cast.length,
      genre: resultSummary.genre.length,
      action: resultSummary.action.length,
      micro: resultSummary.micro.length,
      landmark: resultSummary.landmark.length,
      credits: resultSummary.credits.length,
    }

    this.results = (resultSummary.cast.length === 0) ? this.fileData.data : resultSummary.cast
    this.results = (resultSummary.genre.length === 0) ? (searchGenre.length > 0) ? [] : this.results : resultSummary.genre
    this.results = (resultSummary.action.length === 0) ? (searchAction.length > 0) ? [] : this.results : resultSummary.action
    this.results = (resultSummary.micro.length === 0) ? (searchMicro.length > 0) ? [] : this.results : resultSummary.micro
    this.results = (resultSummary.landmark.length === 0) ? (searchLandmark.length > 0) ? [] : this.results : resultSummary.landmark
    this.results = (resultSummary.credits.length === 0) ? (searchCredits.length > 0) ? [] : this.results : resultSummary.credits

  }

  dynamicSortMultiple(props: string[]) {

    return (obj1: any, obj2: any) => {
        var i = 0, result = 0, numberOfProperties = props.length;
        while(result === 0 && i < numberOfProperties) {
            result = this.dynamicSort(props[i])(obj1, obj2);
            i++;
        }
        return result
    }

  }

  dynamicSort(property: string) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return (a: any,b: any) => {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
  }

  filterData(dataSet: any[], search: any[], rating?: number) {

    return dataSet.filter((item: any) => {

      const found = search.map(search => {

        const key = Object.keys(search)[0]
        const value = parseFloat(search[key])
        if(value === 0) return true

        if(rating) {
          return (item[key] >= rating) ? true : false
        } else {
          return ((item[key] >= (value-this.buffer) && item[key] <= (value))) ? true : false
        }

      })

      return found.includes(true) //OR

    })

  }

  removeDuplicates(data: any[], key: string) {

    return data.filter((value, index, self) =>
    index === self.findIndex((t) => (
      t[key] === value[key]
    ))
    )

  }

  filteredMenuList() {

    // const sections: string[] = Object.keys(this.sections)

    // const resultFiltered: { cast: any[], genre: any[], action: any[], micro: any[], landmark: any[] = { cast:[], genre:[], action:[], micro:[], landmark:[] }

    // sections.map((section: string) => {

    //   const list = this.sections[section]

    //   const filtered = this.results?.filter(items => {
    //     resultFiltered[section] = []
    //     debugger
    //   })

      // console.log(sections[section])
    // })

    // const filteredCast = this.resultDetailsFound.cast.filter(items  => {
    //   const keys = Object.keys(items)
    //   debugger
    // })
    // console.log(this.resultDetailsFound.cast)

  }

  //OLD
  // fileChangeListener($event: any): void {

  //   const files = $event.srcElement.files;
  //   this.header = (this.header as unknown as string) === 'true' || this.header === true;

  //   this.fileData.name = files[0].name.split('Xray.csv')[0].replaceAll('_', ' ')

  //   this.ngxCsvParser.parse(files[0], { header: this.header, delimiter: ',', encoding: 'utf8' })
  //     .pipe().subscribe({
  //       next: (result: any) => {

  //         const keys = (result) ? result[0] : []
  //         result.shift()

  //         this.sections = this.parseSubjects(keys)

  //         result.map((item: any[]) => {

  //           const obj: any = {}

  //           keys.forEach((element: any, index: any): any => {
  //             obj[element] = item[index]
  //           })

  //           this.fileData.data.push(obj)
  //           this.findDetails(this.fileData.name)

  //         })
  //         console.log('DATA-->', this.fileData.data)
  //       },
  //       error: (error: NgxCSVParserError): void => {
  //         console.log('Error', error);
  //       }
  //     });
  // }

  findDetails(contentName: string) {

    // https://api.themoviedb.org/3/search/multi?query=Forest Gump

    this.generalInfo$ = this.findAll(['search', 'multi', `?api_key=${environment.apikey}&query=${contentName}`]).pipe(
      map((data: any) => MovieShowData.adapt(data.results[0])),
      tap((data: MovieShowData) => {
        this.selected = data.backdrop
        this.colorGrabberService.getColorFromImage(data.backdrop)
      })
    )

  }

  onSelectThumb(selected: any) {
    this.colorGrabberService.getColorFromImage(selected.Clips)
    this.selected = selected.Clips
  }

  onSelectedGenre(sections: any) {
    this.sections.genre = sections
    this.searchCriteria.genre = sections
    this.findData()
    this.filteredMenuList()
  }

  onSelectedJson(content: XrayData) {

    this.sections = this.parseSubjectsJson(content.data)

    const categories = Object.keys(this.sections)
    let catStructs = {}
    categories.map(item => {
      this.details.addControl(item, this.fb.control([]))
      catStructs = { ...catStructs, ...{ [item]: []} }
    })

    this.searchCriteria = catStructs

    const fixedData = content.data.map((data: any) => {
      let rec = {}
      const keys = Object.keys(data)
      keys.map(key => {
        if(key === 'Clips' || key === 'Frame') {
          rec = { ...rec, ...{ [key]: data[key] }}
        } else {
          rec = { ...rec, ...data[key]}
        }
      })
      return rec
    })

    this.fileData = { name: content.name, data: fixedData }
    this.findDetails(content.name)
    this.findData()
  }

  onSelectedAction(selection: string[]) {
    this.searchCriteria.action = selection
    this.findData()
    this.filteredMenuList()
  }

  onSelectedMicro(selection: string[]) {
    this.searchCriteria.micro_genre = selection
    this.findData()
    this.filteredMenuList()
  }

  onSelectedLandmark(selection: string[]) {
    this.searchCriteria.landmark = selection
    this.findData()
    this.filteredMenuList()
  }

  onSelectedCredits(selection: string[]) {
    this.searchCriteria.credits = selection
    this.findData()
    this.filteredMenuList()
  }

}
