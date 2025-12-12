import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'linebreaks'
})
export class LineBreaksPipe implements PipeTransform {
  //// word
  transform(value: string | null | undefined): string {
    if (!value) return '';
    return value.replace(/\n/g, '<br>');
  }

}
