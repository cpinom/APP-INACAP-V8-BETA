import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberSeparator'
})
export class NumberSeparatorPipe implements PipeTransform {

  transform(value: string, separator?: string): string {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator || '.');
  }

}