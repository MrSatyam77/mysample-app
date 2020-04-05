import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProformaRoutingModule } from './proforma-routing.module';
import { ProformaListComponent } from './proforma-list/proforma-list.component';
import { ProformanewComponent } from './proforma-new/proforma-new.component';
import { CoreModule } from '@app/core/core.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ProformaListComponent, ProformanewComponent],
  imports: [
    CommonModule,
    ProformaRoutingModule,
    CoreModule,
    FormsModule
  ]
})
export class ProformaModule { }
