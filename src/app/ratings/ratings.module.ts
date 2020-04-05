// External Imports
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

// Internal Imports 
import { RatingsConfirmationComponent } from '@app/ratings/dialog/ratings-confirmation/ratings-confirmation.component';
import { RatingsFeedbackComponent } from '@app/ratings/ratings-feedback/ratings-feedback.component';
import { SharedModule } from '@app/shared/shared.module';
import { RatingsRoutingModule } from '@app/ratings/ratings-routing.module';

import { DialogService } from "@app/shared/services/dialog.service";

@NgModule({
    declarations: [
        // RatingsConfirmationComponent,
        RatingsFeedbackComponent
    ],
    imports: [
        SharedModule,
        FormsModule,
        RatingsRoutingModule
    ],
    entryComponents: [
        // RatingsConfirmationComponent
    ],
    providers:[
        DialogService
    ]
})
export class RatingsModule { }
