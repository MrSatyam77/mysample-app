// Externa Imports
import { Injectable, Inject, PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";

@Injectable({
  providedIn: "root"
})
export class LocalStorageUtilityService {
  constructor(@Inject(PLATFORM_ID) protected platformId: Object) {}

  public addToLocalStorage(key: string, data: any): string {
    if (isPlatformBrowser(this.platformId)) {
      if (typeof localStorage === "undefined") {
        console.error(
          "Your browser does not support HTML5 localStorage.Try upgrading."
        );
        return "Error";
      } else {
        try {
          data = JSON.stringify(data);
          localStorage.setItem(key, data);
          return "Success";
        } catch (e) {
          return "Error";
        }
      }
    }
  }

  public removeFromLocalStorage(key: string): string {
    if (isPlatformBrowser(this.platformId)) {
      if (typeof localStorage === "undefined") {
        console.error(
          "Your browser does not support HTML5 localStorage.Try upgrading."
        );
        return "Error";
      } else {
        try {
          localStorage.removeItem(key);
          return "Success";
        } catch (e) {
          return "Error";
        }
      }
    }
  }

  public getFromLocalStorage(key: string): any {
    if (isPlatformBrowser(this.platformId)) {
      if (typeof localStorage === "undefined") {
        return "Error";
        // $log.error('Your browser does not support HTML5 localStorage.Try upgrading.');
      } else {
        try {
          return JSON.parse(localStorage.getItem(key));
        } catch (e) {
          return "Error";
        }
      }
    }
  }

  public checkLocalStorageKey(key: string): boolean {
    if (isPlatformBrowser(this.platformId)) {
      if (typeof localStorage === "undefined") {
        return false;
        // $log.error('Your browser does not support HTML5 localStorage.Try upgrading.');
      } else {
        try {
          if (localStorage[key]) {
            return true;
          } else {
            return false;
          }
        } catch (e) {
          return false;
        }
      }
    }
  }

  public clearLocalStorage(): any {
    if (isPlatformBrowser(this.platformId)) {
      if (typeof localStorage === "undefined") {
        return "Error";
        // $log.error('Your browser does not support HTML5 localStorage.Try upgrading.');
      } else {
        localStorage.clear();
      }
    }
  }
}
