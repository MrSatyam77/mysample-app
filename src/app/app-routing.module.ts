// External imports
import { NgModule } from "@angular/core";
import { RouterModule, Routes, PreloadAllModules } from "@angular/router";

const AppRoutes: Routes = [
  {
    path: "",
    loadChildren: () => import("./authentication/authentication.module").then(m => m.AuthenticationModule),
  },
  {
    path: "calendar",
    loadChildren: () => import("./calendar/calendar.module").then(m => m.CalendarModule),
  },
  {
    path: "role",
    loadChildren: () => import("./role/role.module").then(m => m.RoleModule),
  },
  {
    path: "ratings",
    loadChildren: () => import("./ratings/ratings.module").then(m => m.RatingsModule),
  },
  {
    path: "home",
    loadChildren: () => import("./dashboard/dashboard.module").then(m => m.DashboardModule)
  },
  {
    path: "eFile",
    loadChildren: () => import("./efile-center/efile-center.module").then(m => m.EfileCenterModule)
  },
  {
    path: "preferences",
    loadChildren: () => import("./preferences/preferences.module").then(m => m.PreferencesModule)
  },
  {
    path: "office",
    loadChildren: () => import("./office/office.module").then(m => m.OfficeModule)
  },
  {
    path: "proforma",
    loadChildren: () => import("./proforma/proforma.module").then(m => m.ProformaModule)
  },
  {
    path: "signature",
    loadChildren: () => import("./signature/signature.module").then(m => m.SignatureModule)
  },
  {
    path: "conversionnew",
    loadChildren: () => import("./conversion/conversion.module").then(m => m.ConversionModule)
  },
  {
    path: "mytaxportal",
    loadChildren: () => import("./my-taxportal/my-taxportal.module").then(m => m.MyTaxportalModule)
  },
  {
    path: "return",
    loadChildren: () => import("./return/return.module").then(m => m.ReturnModule)
  },
  {
    path: "alert",
    loadChildren: () => import("./alert/alert.module").then(m => m.AlertModule)
  },
  {
    path: "instantFormView",
    loadChildren: () => import("./instant-formview/instant-formview.module").then(m => m.InstantFormviewModule)
  },
  {
    path: "return",
    loadChildren: () => import("./return/return.module").then(m => m.ReturnModule)
  },
  {
    path: "manage",
    loadChildren: () => import("./manage/manage.module").then(m => m.ManageModule)
  },
  {
    path: "reports",
    loadChildren: () => import("./reports/reports.module").then(m => m.ReportsModule)
  },
  {
    path: "",
    loadChildren: () => import("./legacy/legacy.module").then(m => m.LegacyModule)
  }
];

// Module Imports
@NgModule({
  imports: [
    RouterModule.forRoot(AppRoutes, { preloadingStrategy: PreloadAllModules })
  ],
  providers: [],
  exports: [RouterModule]
})

// Exports Module
export class AppRoutingModule { }
