// External Imports
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

// Internal Imports
import { AuthenticationGuard } from '@app/shared/guards/authentication.guard';
import { RatingsFeedbackComponent } from '@app/ratings/ratings-feedback/ratings-feedback.component';

const ratingsRoutes: Routes = [
    {
        path: 'your-experience',
        component: RatingsFeedbackComponent,
        canActivate: [AuthenticationGuard],
        data: { access: { requiredAuthentication: true } }
    }
]

@NgModule({
    imports: [RouterModule.forChild(ratingsRoutes)],
    exports: [RouterModule]
})

export class RatingsRoutingModule { }