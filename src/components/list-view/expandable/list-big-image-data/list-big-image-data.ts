import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {Content, FabButton} from "ionic-angular";

/**
 * Generated class for the ListBigImageDataComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'list-big-image-data',
  templateUrl: 'list-big-image-data.html'
})
export class ListBigImageDataComponent {

  @Input() paramsDataManagement: any;//items that parent: true=children,false=not children=description no more
  @Output() changesEmitButtons = new EventEmitter<Object>();
  @Output() resetValuesFilters = new EventEmitter<boolean>();

  constructor() {
   
  }

  ngOnChanges(changes) {

  }

  emitButtonsEvents(dataEvent) {
    this.changesEmitButtons.emit(dataEvent);
  }

  @ViewChild(Content)
  content: Content;
  @ViewChild(FabButton)
  fabButton: FabButton;

  onEvent(eventName: string, item: any) {
    let params = {
      eventName: eventName, item: item
    };
    this.emitButtonsEvents(params);
  }

  toggleGroup(group: any) {
    group.show = !group.show;
  }

  isGroupShown(group: any) {
    return group.show;
  }


}
