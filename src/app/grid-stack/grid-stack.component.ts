import { Component, QueryList, Input, ContentChildren, ElementRef, Renderer2, AfterContentInit, HostListener } from '@angular/core';
import { GridStackOptions } from './grid-stack-options.model';
import { GridStackItem } from './grid-stack-item.model';
import { GridStackItemComponent } from './grid-stack-item.component';
declare var jQuery: any;

@Component({
    selector: 'grid-stack',
    template: `<ng-content></ng-content>`,
    styles: [":host { display: block; }"]
})
export class GridStackComponent implements AfterContentInit {

    @Input() options: GridStackOptions = new GridStackOptions();
    @ContentChildren(GridStackItemComponent) items: QueryList<GridStackItemComponent>;
    private gridStack: any = null;
    private grid: any = null;
    private defaultOptions = {
        cellHeight: '60px'
    };

    /**
     * Calculate Height on Window Resize
     * @param {*} event Resize Event
     * @memberof GridStackComponent
     */
    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.calculateCellHeight();
    }

    constructor(private el: ElementRef, private renderer: Renderer2) {
    }

    /**
     * @author Ravi Shah
     * Create the widget on initialization
     * @private
     * @param {GridStackItemComponent} item
     * @returns
     * @memberof GridStackComponent
     */
    private makeWidget(item: GridStackItemComponent) {
        item.jGridRef = this.grid;
        if (item.option && (item.option.noResize || !item.option.visible)) {
            return;
        }
        this.grid.resizable(item.nativeElement, true);
        this.grid.move(item.nativeElement, item.option.x, item.option.y);
        this.grid.resize(item.nativeElement, item.option.width, item.option.height);
    };

    /**
     * @author Ravi Shah
     * To add widget after removing the widget
     * @param {GridStackItemComponent} item
     * @memberof GridStackComponent
     */
    public addWidget(item: GridStackItemComponent) {
        this.grid.addWidget(item.nativeElement, item.option.x, item.option.y, item.option.width, item.option.height, item.option.autoPosition);
    }

    /**
     * @author Ravi Shah
     * Purpose is to remove widget from the grid stack
     * @param {GridStackItemComponent} item
     * @memberof GridStackComponent
     */
    public removeWidget(item: GridStackItemComponent) {
        try {
            this.grid.removeWidget(item.nativeElement, false);
        } catch (e) {

        }
    }

    /**
     * @author Ravi Shah
     * Purpose is to upate the size of widgets and handle the spacing
     * @param {GridStackItemComponent} item
     * @memberof GridStackComponent
     */
    public updateSize(item: GridStackItemComponent) {
        let width = this.options.width;
        // Calculate the Widget which is stick in the Row
        let allLockedItemOfRow = this.items.filter(t => t.option.y === item.option.y && t.option.locked && t.option.visible).map(t => t.option.width);
        if (allLockedItemOfRow && allLockedItemOfRow.length > 0) {
            const sumOfLockedWidgetsWidth = allLockedItemOfRow.reduce((num1, num2) => num1 + num2, 0)
            width -= sumOfLockedWidgetsWidth;
        }

        // Calculation to update the size when thier is not enough space on right side of widget
        if ((item.option.x + item.option.width) > width) {
            item.option.x = item.option.x - (item.option.width - item.option.x);
            let allRowItems: number[] = (this.items.filter(t => t.option.y === item.option.y && item.option.key !== t.option.key && t.option.visible)).map(t => t.option.height);
            if (allRowItems && allRowItems.length > 0 && allLockedItemOfRow && allLockedItemOfRow.length > 0) {
                item.option.y = Math.max(...allRowItems);
                item.option.x = 0;
            }
        }
        this.grid.update(item.nativeElement, item.option.x, item.option.y, item.option.width, item.option.height);
        this.compactTheEmptySpace('up');
    }

    public compactTheEmptySpace(type: string) {
        switch (type) {
            case 'upAndLeft':
                this.grid.batchUpdate();
                this.compactUpSpace();
                this.compactLeftSpace();
                this.grid.commit();
                break;
            case 'leftAndUp':
                this.grid.batchUpdate();
                this.compactLeftSpace();
                this.compactUpSpace();
                this.grid.commit();
                break;
            case 'left':
                this.grid.batchUpdate();
                this.compactLeftSpace();
                this.grid.commit();
                break;
            case 'up':
                this.grid.batchUpdate();
                this.compactUpSpace();
                this.grid.commit();
                break;
            default:
                break;
        }
    }

    /**
     * @author Ravi Shah
     * Purpose is to Compact empty area on the left side of the widgets
     * @memberof GridStackComponent
     */
    private compactLeftSpace() {

        this.items.forEach(element => {
            let updateCounter = 0;
            let x = element.option.x - element.option.width;
            for (; x >= 0 && this.grid.isAreaEmpty(x, element.option.y, element.option.width, element.option.height);) {
                element.option.x = x;
                x -= 1;
                updateCounter++;
            }
            if (updateCounter > 0) {
                this.grid.update(element.nativeElement, element.option.x, element.option.y, element.option.width, element.option.height);
            }
        });

    }

    /**
     * @author Ravi Shah
     * Purpose is to Compact the empty area on the upside of the widgets
     * @private
     * @memberof GridStackComponent
     */
    private compactUpSpace() {
        this.grid.batchUpdate();
        this.items.forEach(element => {
            let updateCounter = 0;
            let y = element.option.y - element.option.height;
            for (; y >= 0 && this.grid.isAreaEmpty(element.option.x, y, element.option.width, element.option.height);) {
                element.option.y = y;
                y -= 1;
                updateCounter++;
            }
            if (updateCounter > 0) {
                this.grid.update(element.nativeElement, element.option.x, element.option.y, element.option.width, element.option.height);
            }
        });
        this.grid.commit();
    }

    /**
     * @author Ravi Shah
     * Calculate the Height for the Responsive handle
     * @memberof GridStackComponent
     */
    calculateCellHeight() {
        if (window.innerWidth > parseInt(this.options.minWidth)) {
            if (window.innerHeight >= 800) {
                let currentHeight = 12; // 1 ratio is equivalent to height = 3 in gridstack so 3 * 4 for 4 x 4
                let preserveArray = [];
                this.items.forEach(item => {
                    const isExists = preserveArray.findIndex(t => t.option.y === item.option.y);
                    if (isExists === -1) {
                        // currentHeight += item.option.height;
                        preserveArray.push(item);
                    }
                });
                // Formula =  Height of the parent div - (avoid top-bottom margin) * vertical margin
                const gutterSpace = ((currentHeight - 2) * this.options.verticalMargin);
                const height = jQuery('#dashboardMainWrapper').height();
                this.grid.cellHeight(Math.floor((height - gutterSpace) / 12) - 1.25);
            } else {
                let currentHeight = 1; // 1 ratio is equivalent to height = 3 in gridstack so 3 * 4 for 4 x 4
                let preserveArray = [];
                this.items.forEach(item => {
                    const isExists = preserveArray.findIndex(t => t.option.y === item.option.y);
                    if (isExists === -1) {
                        currentHeight += item.option.height;
                        preserveArray.push(item);
                    }
                });
                this.grid.cellHeight((window.innerWidth / this.options.width));
            }
            // 4 by Auto structured
            //  - (gutterSpace / this.options.width)
            // this.grid.cellHeight((window.innerWidth / this.options.width));
        } else {
            this.grid.cellHeight('80px');
        }
    }

    /**
     * @author Ravi Shah
     * Set Attribute to grid stack item
     * @memberof GridStackComponent
     */
    ngAfterContentInit(): void {
        const that = this;
        let nativeElement = this.el.nativeElement;
        if (this.options == null) {
            this.options = new GridStackOptions();
        }
        this.renderer.setAttribute(nativeElement, 'data-gs-width', String(this.options.width));
        this.renderer.setAttribute(nativeElement, 'data-gs-height', String(this.options.height));
        this.gridStack = jQuery(nativeElement).gridstack(JSON.parse(JSON.stringify(this.options)));
        this.grid = this.gridStack.data('gridstack');
        this.calculateCellHeight();

        this.gridStack.on('change', (e: any, items: any) => {
            if (items) {
                items.forEach((item: any) => this.widgetChanged(item));
                this.calculateCellHeight();
                this.compactTheEmptySpace('up');
            }
        });
        // Initialize widgets
        this.items.forEach(item => that.makeWidget(item));
    }

    /**
     * @author Ravi Shah
     * Call on Widget Item Changes on Drag and Drop or Resize
     * @private
     * @param {GridStackItem} change
     * @returns {void}
     * @memberof GridStackComponent
     */
    private widgetChanged(change: GridStackItem): void {
        const jWidget = change.el;
        const gridStackItem = this.items.find(item => item.jWidgetRef !== null ? item.jWidgetRef === jWidget[0] : false);
        if (!gridStackItem || (gridStackItem.option && !gridStackItem.option.visible)) {
            return;
        }
        gridStackItem.update(change.x, change.y, change.width, change.height, gridStackItem.option.backgroundColor, gridStackItem.option.foregroundColor);
    }
}
