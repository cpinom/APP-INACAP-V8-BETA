import { Directive, HostListener } from '@angular/core';
import * as $ from 'jquery';
import { UtilsService } from '../services/utils.service';

@Directive({
  selector: '[delegate]'
})
export class DelegateDirective {

  constructor(private utils: UtilsService) { }

  @HostListener('click', ['$event']) onClick(event: any) {
    const link = $(event.target).closest('a[href]');

    if (link.length) {
      event.preventDefault();
      const url = $(link).attr('href');
      if (url) {
        this.utils.openLink(url);
      }
    }
  }

}
