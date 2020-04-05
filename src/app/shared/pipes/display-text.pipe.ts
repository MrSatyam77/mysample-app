import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'displayText' })
export class DisplayTextPipe implements PipeTransform {
  transform(filterId: any, collection: any): string {
    if (collection) {
      var _object = collection.find(t => t.id === filterId);
      if (_object && _object.name) {
        return _object.name;
      } else {
        return 'None'
      }
    } else {
      return 'None'
    }
  }
}