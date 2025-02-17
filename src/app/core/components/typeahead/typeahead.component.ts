import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';

@Component({
  selector: 'app-typeahead',
  templateUrl: './typeahead.component.html',
  styleUrls: ['./typeahead.component.scss'],
})
export class TypeaheadComponent implements OnInit {

  @ViewChild('content', { static: false }) content!: IonContent;
  @Input() title = 'Seleccionar Sala';
  @Input() items: any[] = [];
  @Input() selectedItem: any;
  @Output() selectionCancel = new EventEmitter<void>();
  @Output() selectionChange = new EventEmitter<string[]>();

  selectedValue: any;
  filteredItems: any[] = [];

  constructor() { }
  ngOnInit() {
    this.filteredItems = [...this.items];
    this.selectedValue = this.selectedItem;

    setTimeout(async () => {
      const targetIndex = this.filteredItems.indexOf(this.selectedValue);

      if (targetIndex > -1) {
        const yOffset = document.getElementById(`item-${targetIndex}`)?.offsetTop || 0;
        await this.content.scrollToPoint(0, yOffset, 500)
      }
    }, 200)

  }
  cancelChanges() {
    this.selectionCancel.emit();
  }
  confirmChanges() {
    this.selectionChange.emit(this.selectedValue);
  }
  searchbarInput(ev: any) {
    this.filterList(ev.target.value);
  }
  filterList(searchQuery: string | undefined) {
    if (searchQuery === undefined) {
      this.filteredItems = [...this.items];
    }
    else {
      const normalizedQuery = searchQuery.toLowerCase();
      this.filteredItems = this.items.filter((item) => {
        return item.text.toLowerCase().includes(normalizedQuery);
      });
    }

    this.selectedValue = undefined;
  }

}
