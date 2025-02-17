import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'titleCase'
})
export class TitleCasePipe implements PipeTransform {

  transform(value: string): string {
    if (!value) {
      return '';
    }
    else {
      const words = value.split(' ');
      for (let i = 0; i < words.length; i++) {
        const word = words[i];
        if (i > 0 && this.isPreposition(word)) {
          words[i] = word.toLowerCase();
        }
        else if (i > 0 && word.indexOf('(') !== -1) {
          words[i] = word;
        }
        else {
          words[i] = this.capitalize(word);
        }
      }
      return words.join(' ');
    }
  }

  private capitalize(word: string): string {
    return word.substr(0, 1).toUpperCase() + word.substr(1).toLowerCase();
  }

  isPreposition(word: string): boolean {
    const prepositions = [
      'a',
      'con',
      'de',
      'en',
      'para',
      'y',
      'la',
      'el',
      'las',
      'los',
      'un',
      'una',
      'unos',
      'unas'
    ];
    return prepositions.includes(word.toLowerCase());
  }

}
