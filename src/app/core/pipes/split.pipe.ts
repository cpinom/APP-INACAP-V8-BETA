import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'split'
})
export class SplitPipe implements PipeTransform {

  transform(value: string, splitChar: string, splitIndex: number): string {
    if (value && value.indexOf(splitChar) > -1) {
      return value.split(splitChar)[splitIndex];
    }
    return value;
  }

}
