import {Pipe, PipeTransform} from '@angular/core';
import * as  ConstantsSort from "../sort-business/sort-business-constants";

@Pipe({
  name: 'sort',
})
export class SortBusinessPipe implements PipeTransform {
  transform(array: Array<string>, args?: any): Array<string> {
    if (!args.property) return array;
    if (!args.order) return array;
    let order = args.order;
    return array.sort(function (a, b) {
      if (args.property == ConstantsSort.ColumnsNameNumber.transactions_amount) {
        let valueA = order == 1 ? parseFloat(a[args.property]) : parseFloat(b[args.property]);
        let valueB = order == 1 ? parseFloat(b[args.property]) : parseFloat(a[args.property]);
        return valueA - valueB;
      } else {
        return a[args.property].localeCompare(b[args.property])*(order);
      }
    });
  }
}
