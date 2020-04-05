import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'filter'
})
export class FilterPipe implements PipeTransform {
    transform(items: any[], searchText: string, parent: string): any[] {
        if (!items) return [];
        if (!searchText) return items;
        searchText = searchText.toLowerCase();
        let parentitem = [];
        if (parent == 'parent') {
            for (const child of items) {
                if (child.visible) {
                    if (child.name.toLowerCase().includes(searchText.toLowerCase())) {
                        parentitem.push(child)
                    } else if (child.subModule) {
                        const childFilterItem = child.subModule.filter(it => {
                            return it.name.toLowerCase().includes(searchText.toLowerCase());
                        });
                        if (childFilterItem && childFilterItem.length > 0) {
                            parentitem.push(child)
                        }
                    }
                }
            }
        } else {
            parentitem = items.filter(it => {
                return it.name.toLowerCase().includes(searchText.toLowerCase());
            });
        }



        return parentitem;
    }
}