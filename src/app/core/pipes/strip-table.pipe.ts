 import { Pipe, PipeTransform } from '@angular/core';
 import $ from "jquery";
 
@Pipe({
  name: 'stripTable'
})
export class StripTablePipe implements PipeTransform {

  transform(value: string): string {
    let $wrapper = $('<div />').append(value);
    let $tables = $('table', $wrapper);

    $wrapper.find('.MsoNormal, .MsoNormalCxSpMiddle, .MsoNormalCxSpFirst, .MsoListParagraphCxSpFirst').removeAttr('class');
    $wrapper.find('[align]').removeAttr('align');

    $tables.removeAttr('class');
    $tables.removeAttr('width');
    $tables.removeAttr('border');
    $tables.removeAttr('cellspacing');
    $tables.removeAttr('cellpadding');
    $tables.find('th, td').removeAttr('width').removeAttr('valign').removeAttr('nowrap');
    $tables.find('[align]').removeAttr('align');
    $tables.find('[bgcolor]').removeAttr('bgcolor');
    $tables.find('font').contents().unwrap();
    $tables.wrap('<div class="wrapper"></div>');

    return $wrapper.html();
  }

}
