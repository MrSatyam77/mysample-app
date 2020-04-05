import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'titleFilter'
})
export class titleFilterPipe implements PipeTransform {
    transform(items: any[], searchText: string, parent: string): any[] {
        if (!items) { return []; }
        if (!searchText) { return items; }
        searchText = searchText.toLowerCase();
        let parentitem = [];
        if (parent === 'parent') {
            for (const child of items) {
                if (child.title.toLowerCase().includes(searchText.toLowerCase())) {
                    parentitem.push(child)
                } else if (child.description) {
                    if (child.description.toLowerCase().includes(searchText.toLowerCase())) {
                        parentitem.push(child)
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
