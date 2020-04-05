import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common'

import { EfileBankComponent } from './efile-bank/efile-bank.component';
import { EfileComponent } from './components/efile/efile.component';
import { BankEfileCenterComponent } from './components/bank-efile-center/bank-efile-center.component';
import { EfileCenterRoutingModule } from './efile-center.routing';
import { CoreModule } from '@app/core/core.module';
import { SharedModule } from '@app/shared/shared.module';
import { EfileCenterService } from './efile-center.service';
import { EfilePrintListComponent } from './efile-print-list/efile-print-list.component';


@NgModule({
  declarations: [EfileBankComponent, EfileComponent, BankEfileCenterComponent, EfilePrintListComponent],
  imports: [
    CoreModule,
    FormsModule,
    SharedModule,
    CommonModule,
    EfileCenterRoutingModule
  ],
  providers: [CurrencyPipe, EfileCenterService],
  entryComponents: []
})

export class EfileCenterModule { }
