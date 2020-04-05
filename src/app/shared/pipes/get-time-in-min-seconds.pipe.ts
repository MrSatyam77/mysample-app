//Internal Imports
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getTimeInMinutesAndSeconds'
})

export class GetTimeInMinutesAndSecondsPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    let mm = Math.floor((value % (1000 * 60 * 60)) / (1000 * 60)) + '';
    while (mm.length < 2) {
      mm = '0' + mm;
    }

    let ss = Math.floor((value % (1000 * 60)) / (1000)) + '';
    while (ss.length < 2) {
      ss = '0' + ss;
    }

    return mm + ':' + ss;
  }
}
