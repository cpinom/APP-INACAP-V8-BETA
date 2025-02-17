import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'summary'
})
export class SummaryPipe implements PipeTransform {

  transform(value: string, limit?: number) {
    const actualLimit = (limit) ? limit : 50;
    if (!value) {
      return null;
    }
    else {
      if (value.length > actualLimit) {
        return value.substr(0, actualLimit) + '...';
      }
      else {
        return value;
      }
    }
  }

}
