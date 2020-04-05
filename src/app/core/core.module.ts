import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimpleAgGridComponent } from './simple-ag-grid/simple-ag-grid.component';
import { AgGridModule } from 'ag-grid-angular';
import { StandardAgGridComponent } from './standard-ag-grid/standard-ag-grid.component';

@NgModule({
  declarations: [SimpleAgGridComponent, StandardAgGridComponent],
  imports: [
    AgGridModule.withComponents([]),
    CommonModule
  ],
  exports: [StandardAgGridComponent]
})
export class CoreModule { }
