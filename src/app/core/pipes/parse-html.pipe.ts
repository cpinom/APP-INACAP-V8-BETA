import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'parseHTML'
})
export class ParseHTMLPipe implements PipeTransform {

  transform(value: string): string {
    let parser = new DOMParser();
    let parsedHtml = parser.parseFromString(value, 'text/html');
    return parsedHtml.getElementsByTagName('body')[0].innerHTML;
  }

}
