// External Imports
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UpgradeModule, downgradeComponent, downgradeInjectable } from "@angular/upgrade/static";
import { RouterModule } from "@angular/router";
import { setUpLocationSync } from "@angular/router/upgrade";
import * as angular from "angular";

// Internal Imports
import { EmptyComponent } from "@app/legacy/empty/empty.component";
import { AuthenticationService } from '@app/authentication/authentication.service';
import { UserService, SubscriptionService, ResellerService, SystemConfigService, BasketService, UtilityService, RTCSocketService, CommunicationService, ConfigService, eFileSumaryListService, BankRejectionService } from '@app/shared/services/index';
import { FinancialProductsService } from '@app/dashboard/widgets/financial-products/financial-products.service';
import { BrowserService } from '@app/shared/services/browser.service';
import { SentryService } from '@app/shared/services/sentry.service';
import {SignatureService} from '@app/signature/signature.service';
import { SocketService } from '@app/shared/services/socket.service';
import { ReturnAPIService } from '@app/return/return-api.service';
import { PrintingEngineService } from '@app/Printing-engine/Printing-engine.service';
import { SavePrintConfigurationService } from '@app/Printing-engine/save-print-configuration.service';
import { OfficeService } from '@app/office/office.service';

@NgModule({
  declarations: [EmptyComponent],
  imports: [
    CommonModule,
    UpgradeModule,
    RouterModule.forChild([{ path: "**", component: EmptyComponent }])
  ],
  providers: []
})

export class LegacyModule {
  constructor(private _upgrade: UpgradeModule) {
    this._upgrade.bootstrap(document.documentElement, ["taxApp"]);
    setUpLocationSync(this._upgrade);
    // let auth = this._upgrade.injector.get("authService");
    // console.log(auth.getData());
  }
}

angular.module('taxApp')
  // .directive('angularComponent', downgradeComponent({ component: AngularComponent }) as angular.IDirectiveFactory)
  .factory('authService', downgradeInjectable(AuthenticationService))
  .factory('userService', downgradeInjectable(UserService))
  .factory('resellerService', downgradeInjectable(ResellerService))
  .factory('systemConfig', downgradeInjectable(SystemConfigService))
  .factory('basketService', downgradeInjectable(BasketService))
  .factory('utilityService', downgradeInjectable(UtilityService))
  .factory('subscriptionService', downgradeInjectable(SubscriptionService))
  .factory('browserService', downgradeInjectable(BrowserService))
  .factory("rtcSocketService", downgradeInjectable(RTCSocketService))
  .factory("returnAPIService", downgradeInjectable(ReturnAPIService))
  .factory("eFileSumaryListService", downgradeInjectable(eFileSumaryListService))
  .factory("communicationService", downgradeInjectable(CommunicationService))
  .factory("configService", downgradeInjectable(ConfigService))
  .factory("bankRejectionListService", downgradeInjectable(BankRejectionService))
  .factory("sentryService", downgradeInjectable(SentryService))
  .factory('bankProductsService', downgradeInjectable(FinancialProductsService))
  .factory('signatureService', downgradeInjectable(SignatureService))
  .factory('socketService', downgradeInjectable(SocketService))
  .factory('printingEngineService', downgradeInjectable(PrintingEngineService))
  .factory('savePrintConfigurationService', downgradeInjectable(SavePrintConfigurationService))
  .factory('officeService', downgradeInjectable(OfficeService))
