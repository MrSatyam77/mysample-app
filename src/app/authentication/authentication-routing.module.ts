// External Imports
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

// Internal Imports
import { LoginComponent } from '@app/authentication/login/login.component';
import { AuthenticationGuard } from '@app/shared/guards/authentication.guard';
import { LogoutComponent } from '@app/authentication/logout/logout.component';
import { RegistrationComponent } from './registration/registration.component';


const authenticationRoutes: Routes = [
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [AuthenticationGuard],
    },
    {
        path: 'login/:option',
        component: LoginComponent,
        canActivate: [AuthenticationGuard],
    },
    {
        path: 'registration',
        component: RegistrationComponent,
        canActivate: [AuthenticationGuard],
    },
    {
        path: 'logout',
        component: LogoutComponent,
        canActivate: [AuthenticationGuard],
        data: { access: { requiredAuthentication: true } }
    },
    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
    }
]

@NgModule({
    imports: [RouterModule.forChild(authenticationRoutes)],
    exports: [RouterModule]
})

export class AuthenticationRoutingModule { }