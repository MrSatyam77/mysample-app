// External Imports
import { Injectable, Injector } from '@angular/core';

// Internal Imports
import { CommonAPIService } from "@app/shared/services/common-api.service";
import { UserService } from "@app/shared/services/user.service";
import { APINAME } from "@app/ratings/ratings.constants";

@Injectable({
    providedIn: 'root'
})


export class RatingService {

    public userDetails = this._userService.getUserDetails();

    constructor(
        private _commonAPI: CommonAPIService,
        private _userService: UserService
    ) { }

    // to send demo account info mail
    public saveRattings(ratingResponse: Object) {
        return new Promise((resolve, reject) => {
            this._commonAPI.getPromiseResponse({
                apiName: APINAME.SAVE_RATINGS,
                parameterObject: ratingResponse
            }).then((response) => {
                resolve(response.data);
            }, (error) => {
                reject(error);
            });
        })
    }


    public ratingDisplay() {
        return new Promise((resolve, reject) => {
            this._commonAPI.getPromiseResponse({
                apiName: APINAME.RATINGS_DISPLAY,
                parameterObject: { }
            }).then((response) => {
                resolve(response.data.askForRating);
            }, (error) => {
                reject(error);
            });
        })
    }
}