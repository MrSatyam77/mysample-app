# HybridApp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.0.0-rc.4.
This project is an Angular 8 project. Technologies used: Angular 8, TypeScript, AG-Grid, Kendo-UI, Material-Angular, SCSS, Bootstrap 4 and HTML. To run this project, install node modules using `npm i` command and run `ng serve`.

---

## How Angular 8 and AngularJS Are Combined

This application is a **hybrid Angular + AngularJS application**. It runs **Angular 8** (TypeScript) and **AngularJS 1.4.14** (JavaScript) side-by-side in the same browser tab using the official `@angular/upgrade` package.

---

### Key Files at a Glance

| Purpose | File |
|---|---|
| Angular 8 entry point / hybrid bridge setup | `src/main.ts` |
| Root Angular module | `src/app/app.module.ts` |
| Angular routes (lazy-loaded modules) | `src/app/app-routing.module.ts` |
| **Hybrid bridge module** (boots AngularJS, downgrades Angular services) | `src/app/legacy/legacy.module.ts` |
| Upgraded AngularJS providers available in Angular | `src/app/legacy/legacy-providers.ts` |
| AngularJS main module definition | `src/taxAppJs/tax-app.js` |
| AngularJS routes | `src/taxAppJs/tax-routes.js` |

---

### Step-by-Step Bootstrap Flow

#### 1. `src/main.ts` — Angular entry point + AngularJS global registration

```typescript
import { setAngularJSGlobal } from "@angular/upgrade/static";
import * as angular from "angular";

// Make AngularJS available globally to the @angular/upgrade bridge
setAngularJSGlobal(angular);

// Bootstrap the Angular 8 root module
platformBrowserDynamic().bootstrapModule(AppModule);
```

**What happens here:**
- `setAngularJSGlobal(angular)` tells `@angular/upgrade` where the AngularJS runtime is.
- `platformBrowserDynamic().bootstrapModule(AppModule)` starts the Angular 8 application.
- AngularJS is **not** bootstrapped yet at this point — that happens later via `LegacyModule`.

---

#### 2. `src/app/app-routing.module.ts` — Angular router with a catch-all for AngularJS

```typescript
const AppRoutes: Routes = [
  { path: "",         loadChildren: () => import("./authentication/authentication.module").then(m => m.AuthenticationModule) },
  { path: "home",     loadChildren: () => import("./dashboard/dashboard.module").then(m => m.DashboardModule) },
  { path: "return",   loadChildren: () => import("./return/return.module").then(m => m.ReturnModule) },
  { path: "calendar", loadChildren: () => import("./calendar/calendar.module").then(m => m.CalendarModule) },
  // ... other Angular 8 routes ...

  // LAST ROUTE: catch-all that loads the AngularJS bridge module
  { path: "", loadChildren: () => import("./legacy/legacy.module").then(m => m.LegacyModule) }
];
```

**What happens here:**
- All named Angular 8 routes (`home`, `return`, `calendar`, etc.) are handled by Angular 8 modules directly.
- The final empty-path catch-all route loads `LegacyModule`, which bootstraps AngularJS and hands control over to it.
- Any URL that does not match an Angular 8 route falls through to `LegacyModule` and is then handled by the AngularJS `$routeProvider`.

---

#### 3. `src/app/legacy/legacy.module.ts` — The Hybrid Bridge (most important file)

This file is the **heart of the hybrid setup**. It does three things:

**A. Bootstraps AngularJS inside Angular 8**

```typescript
export class LegacyModule {
  constructor(private _upgrade: UpgradeModule) {
    // Bootstrap AngularJS app ("taxApp") on the entire document
    this._upgrade.bootstrap(document.documentElement, ["taxApp"]);

    // Synchronise Angular Router's URL with AngularJS $location
    setUpLocationSync(this._upgrade);
  }
}
```

- `_upgrade.bootstrap(document.documentElement, ["taxApp"])` starts the AngularJS 1.x application named `"taxApp"` (defined in `src/taxAppJs/tax-app.js`).
- `setUpLocationSync(_upgrade)` keeps Angular Router and AngularJS `$location`/`$routeProvider` in sync so the browser URL bar reflects the correct route in both frameworks.

**B. Imports `UpgradeModule`**

```typescript
@NgModule({
  declarations: [EmptyComponent],
  imports: [
    CommonModule,
    UpgradeModule,   // <-- enables the hybrid bridge
    RouterModule.forChild([{ path: "**", component: EmptyComponent }])
  ]
})
export class LegacyModule { ... }
```

- `UpgradeModule` (from `@angular/upgrade/static`) is the official bridge between Angular 8 and AngularJS.
- `EmptyComponent` is a blank Angular component used as the placeholder route target so Angular Router has something to render while AngularJS takes over the page content.

**C. Downgrades Angular 8 Services so AngularJS can use them**

```typescript
import { downgradeInjectable } from "@angular/upgrade/static";

angular.module('taxApp')
  .factory('authService',                downgradeInjectable(AuthenticationService))
  .factory('userService',                downgradeInjectable(UserService))
  .factory('systemConfig',               downgradeInjectable(SystemConfigService))
  .factory('basketService',              downgradeInjectable(BasketService))
  .factory('utilityService',             downgradeInjectable(UtilityService))
  .factory('subscriptionService',        downgradeInjectable(SubscriptionService))
  .factory('communicationService',       downgradeInjectable(CommunicationService))
  .factory('configService',              downgradeInjectable(ConfigService))
  .factory('returnAPIService',           downgradeInjectable(ReturnAPIService))
  .factory('socketService',              downgradeInjectable(SocketService))
  .factory('printingEngineService',      downgradeInjectable(PrintingEngineService))
  .factory('officeService',              downgradeInjectable(OfficeService))
  // ... and more
```

- `downgradeInjectable(AngularService)` wraps an Angular 8 `@Injectable` service so it can be injected into AngularJS controllers, services, and directives as a regular AngularJS factory.
- This means Angular 8 owns the single source of truth for these services; AngularJS code simply consumes them.

---

#### 4. `src/app/legacy/legacy-providers.ts` — Upgrading AngularJS Services for Angular 8

```typescript
// Allow an Angular 8 class to inject an AngularJS service
function roleServiceFactory($injector) {
  return $injector.get("rolesService");   // get from AngularJS DI
}

export const RoleServiceProvider = {
  provide: "rolesService",
  useFactory: roleServiceFactory,
  deps: ["$injector"]
};
```

- This is the **reverse direction**: an AngularJS service (`rolesService`) is made available inside Angular 8's DI system.
- Any Angular 8 component/service can then inject it with `@Inject("rolesService")`.

---

#### 5. `src/taxAppJs/tax-app.js` — AngularJS Root Module

```javascript
var app = angular.module('taxApp', [
  'ngAnimate', 'ngCookies', 'ngSanitize',
  'pascalprecht.translate',    // i18n
  'ui.bootstrap',              // Bootstrap UI components
  'kendo.directives',          // Kendo UI widgets
  'taxRoutes',                 // AngularJS routing module
  'returnApp',                 // Tax return sub-module
  // ... many more AngularJS sub-modules
]);
```

- This is the AngularJS 1.x app that is bootstrapped by `LegacyModule`.
- It depends on many AngularJS-era libraries (UI-Bootstrap, Kendo, ngTable, etc.).
- Its controllers, directives, and services live under `src/taxAppJs/`.

---

#### 6. `src/taxAppJs/tax-routes.js` — AngularJS Routes

```javascript
taxRoutes.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/return/edit/:id?', {
        controller: 'returnController',
        templateUrl: '/taxAppJs/return/workspace/partials/returnWorkspace.html'
    })
    .when('/estimator', {
        templateUrl: '/taxAppJs/estimator/partials/estimator.html'
    })
    .when('/manage/user/list', { ... })
    // ... more AngularJS routes
}]);
```

- These are the routes handled **by AngularJS** (the legacy side).
- They are activated when the Angular catch-all route passes control to `LegacyModule`.
- `setUpLocationSync` (called in `LegacyModule`) ensures the browser URL stays consistent between both routers.

---

### Communication Flow Summary

```
User Opens App
      │
      ▼
src/main.ts
  ├─ setAngularJSGlobal(angular)    ← register AngularJS runtime with @angular/upgrade
  └─ bootstrapModule(AppModule)     ← start Angular 8

Angular 8 Router evaluates URL
  ├─ /home, /calendar, /return ...  → Angular 8 modules handle these routes
  └─ (catch-all)                    → LegacyModule loaded

LegacyModule constructor
  ├─ _upgrade.bootstrap(doc, ["taxApp"])  ← start AngularJS inside Angular 8
  ├─ setUpLocationSync(_upgrade)          ← sync both routers
  └─ downgradeInjectable(...)             ← Angular 8 services available in AngularJS

AngularJS $routeProvider
  └─ handles /return/edit/:id, /estimator, /manage/* etc. (legacy routes)

Service Sharing
  ├─ Angular 8 → AngularJS:  downgradeInjectable()  (in legacy.module.ts)
  └─ AngularJS → Angular 8:  upgraded via $injector  (in legacy-providers.ts)
```

---

### Where Each Technology Handles What

| Feature Area | Framework | Location |
|---|---|---|
| Login / Registration | Angular 8 | `src/app/authentication/` |
| Dashboard | Angular 8 | `src/app/dashboard/` |
| Calendar | Angular 8 | `src/app/calendar/` |
| E-File Center | Angular 8 | `src/app/efile-center/` |
| Office | Angular 8 | `src/app/office/` |
| Preferences | Angular 8 | `src/app/preferences/` |
| Proforma | Angular 8 | `src/app/proforma/` |
| Signature | Angular 8 | `src/app/signature/` |
| Reports | Angular 8 | `src/app/reports/` |
| Tax Return Workspace | AngularJS | `src/taxAppJs/return/` |
| Estimator | AngularJS | `src/taxAppJs/estimator/` |
| Bank Products | AngularJS | `src/taxAppJs/bank/` |
| Management screens (legacy) | AngularJS | `src/taxAppJs/manage/` |
| Shared HTTP/API services | Angular 8 | `src/app/shared/services/` |
| Hybrid bridge | Both | `src/app/legacy/` |

---

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
