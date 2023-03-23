import { ResultsDisplayModule } from './results-display/results-display.module';
import { MicroSelectionModule } from './micro-selection/micro-selection.module';
import { LandmarkSelectionModule } from './landmark-selection/landmark-selection.module';
import { GenreSelectionModule } from './genre-selection/genre-selection.module';
import { XRAYContentFinderComponent } from './xray-content-finder.component';
import { JsonFileSelectorModule } from './json-file-selector/json-file-selector.module';
import { CastSelectionComponent } from './cast-selection/cast-selection.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxCsvParserModule } from 'ngx-csv-parser';
import { MaterialModule } from '../material.module';
import { ImageCompositorModule } from './image-compositor/image-compositor.module';
import { GenreListSelectorModule } from './genre-list-selector/genre-list-selector.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    NgxCsvParserModule,
    JsonFileSelectorModule,
    GenreSelectionModule,
    LandmarkSelectionModule,
    MicroSelectionModule,
    ImageCompositorModule,
    LandmarkSelectionModule,
    GenreListSelectorModule,
    ResultsDisplayModule,
  ],
  declarations: [
    XRAYContentFinderComponent,
    CastSelectionComponent,
  ], exports: [
    XRAYContentFinderComponent,
  ]
})
export class XRAYContentFindersModule { }
