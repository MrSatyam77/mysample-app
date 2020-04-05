// External Imports
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class BasketService {
    //holds list of items 
    private items = [];

    /**
     * @author Heena Bhesaniya
     * @description just storing item at key position. 
     * @param key key name is feature name or any name
     * @param item data that need to be stored 
     */
    public pushItem(key, item) {
        this.items[key] = item;
    }


    /**
     * @author Heena Bhesaniya
     * @description remove item at key position and also remove item with its key after getting it's value 
     * @param key key name is feature name or any name
     */
    public popItem(key) {
        if (this.items[key]) {
            let returnPopItem = this.items[key];
            delete this.items[key];
            return returnPopItem;
        }
    }
}
