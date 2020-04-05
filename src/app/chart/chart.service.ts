import { Injectable } from "@angular/core";
import { ISettings } from './bar-chart/barchart';

@Injectable({ providedIn: "root" })
export class ChartCommanService {
    /**
    * @author Hitesh Soni
    * @description Get MAX value from array
    * @createdDate 07-08-2019
    */
    getMaxValue(filedName: string, data: any): number {
        return Math.max.apply(Math, data.filter(x => (x[filedName] != null && x[filedName] != undefined)).map(x => x[filedName]));
    }

    /**
    * @author Hitesh Soni
    * @description Get Min value from array
    * @createdDate 07-08-2019
    */
    getMinValue(filedName: string, data: any): number {
        return Math.min.apply(Math, data.filter(x => (x[filedName] != null && x[filedName] != undefined)).map(x => x[filedName]));
    }

    /**
     * @author Hitesh Soni
     * @description Get tax width
     * @createdDate  07-08-2019
     */
    getTextWidth(text, font) {
        let canvas = document.createElement("canvas");
        let context = canvas.getContext("2d");
        context.font = font;
        let metrics = context.measureText(text);
        return metrics.width;
    }

    /**
    * @author Hitesh Soni
    * @description Find location of x
    * @createdDate 07-08-2019
    */
    findXLocation(data: any, filedName: string, xValue, settings: ISettings) {
        let xPosition = 0;
        let k = 0;
        for (let x = 0; x <= settings.areaWidth; x += settings.xStepSize) {
            if (data[k][filedName] == xValue) {
                xPosition = x;
                break;
            }
            k++;
        }
        return xPosition;
    }
}