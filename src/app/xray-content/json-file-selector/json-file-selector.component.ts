import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';

import { XRAY } from './constants';
import { XrayData } from './xray-data.model';

@Component({
  selector: 'app-json-file-selector',
  templateUrl: './json-file-selector.component.html',
  styleUrls: ['./json-file-selector.component.css']
})
export class JsonFileSelectorComponent implements OnInit {

  xraySelections: { name: string, file: string }[] = []
  selectedDataFile: { name: string, file: string } | undefined

  selecedXray = this.fb.control(null, Validators.required)

  get isValid() {
    return this.selecedXray.valid
  }

  @Output() selectedJson = new EventEmitter<XrayData>()

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
    ) { }

  ngOnInit() {
    this.xraySelections = XRAY
  }

  private getJSON(file: string): Observable<any> {
    return this.http.get(`assets/data/${file}`)
  }

  onSelected(file: { name: string, file: string}) {
    this.selectedDataFile = file
  }

  onOpenXray() {
    if(this.selectedDataFile && this.selecedXray.valid) {

      this.getJSON(this.selectedDataFile.file).subscribe(data => {

        const fileData = {
          ...this.selectedDataFile,
          data: data
        }

        this.selectedJson.emit(XrayData.adapt(fileData))

       })

    }
  }

}


