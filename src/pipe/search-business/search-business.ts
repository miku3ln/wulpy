import {Pipe, PipeTransform} from '@angular/core';

/**
 * Generated class for the SearchPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'search',
})
export class SearchBusinessPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(items: any[], args?: any): any[] {
    if (!items) return [];
    if (!args) return items;
    if (!args.terms || args.terms == "empty") return items;
    var terms = args.terms;
    var columSearch = args.colum;
    return items.filter(it => {
      if (columSearch) {

        return it[columSearch].toLowerCase().includes(terms.toLowerCase());
      } else {
        return it["transaction_subtype_id"] == (terms);
      }

    });
  }
}
