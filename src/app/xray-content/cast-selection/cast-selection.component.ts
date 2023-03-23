import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { CrudService } from 'src/app/http-service/services/crud.service';
import { environment } from 'src/environments/enviroment';
import { PersonData } from '../models/person-data.model';

@Component({
  selector: 'app-cast-selection',
  templateUrl: './cast-selection.component.html',
  styleUrls: ['./cast-selection.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: CastSelectionComponent,
    multi: true
  }]
})
export class CastSelectionComponent extends CrudService<any> implements OnInit, ControlValueAccessor {

  _cast: string[] = []

  @Input() set cast(value: string[]) {
    this._cast = value
    this.castInformation(value)
  }

  get cast() {
    return this._cast
  }

  @Input() textColor: any = '#000000'

  castMembersInfo: PersonData[] = []

  isSelected = (item: PersonData) => (this.castSelected.find(list => list === item.name)) ? true : false

  onChange = (value: string[]) => {}
  onTouched = () => {}

  constructor() {
    super(environment.api)
  }

  castSelected: string[] = []

  ngOnInit() {
  }

  castInformation(cast: string[] = []) {

    const req: any[] = []

    cast.map(person => {
      const personInfo = this.findAll(['search', 'person', `?api_key=${environment.apikey}&query=${person}`])
      req.push(personInfo)
    })

    forkJoin(req).subscribe(info => {

      info.map(item => {

        const profiles = item.results as PersonData[]
        const person = PersonData.adapt(profiles[0])
        this.castMembersInfo.push(person)

      })

    })



  }

  onSelected(selected: PersonData) {

    const foundIndex = this.castSelected.findIndex(item => item === selected.name)

    if(foundIndex > -1) {
      this.castSelected.splice(foundIndex, 1)
    } else {
      this.castSelected.push(selected.name)
    }

    this.onChange(this.castSelected)

  }

  writeValue(value: any) {
    console.log(value)
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {

  }

}
