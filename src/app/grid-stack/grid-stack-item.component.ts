import { Component, Input, Output, OnInit, ComponentRef, ElementRef, ViewChild, Renderer2, EventEmitter, OnDestroy, AfterViewInit, ViewContainerRef } from '@angular/core';
import { GridStackItem } from './grid-stack-item.model';

@Component({
    selector: 'grid-stack-item',
    template: `<div class='grid-stack-item-content'>
              <div #contentPlaceholder *ngIf='contentTemplate'></div>
              <ng-content *ngIf='!contentTemplate'></ng-content>
            </div>`
})
export class GridStackItemComponent implements OnInit, OnDestroy {

    // Variable Initialization
    @ViewChild('contentPlaceholder', { read: ViewContainerRef, static: false }) contentPlaceholder: ViewContainerRef;
    @Input() contentTemplate: string;
    @Input() option: GridStackItem;
    @Output() onGridConfigurationChanged = new EventEmitter<GridStackItem>();
    contentComponentRef: ComponentRef<any> = null;
    jGridRef: any = null;
    public jWidgetRef: ElementRef = null;

    /**
     * Creates an instance of GridStackItemComponent.
     * @param {ElementRef} el
     * @param {Renderer2} renderer
     * @memberof GridStackItemComponent
     */
    constructor(private el: ElementRef, private renderer: Renderer2) {
        this.jWidgetRef = el.nativeElement;
    }

    /**
     * Get the Native Element of the Grid stack item
     * @readonly
     * @type {HTMLElement}
     * @memberof GridStackItemComponent
     */
    get nativeElement(): HTMLElement {
        return this.el.nativeElement;
    }

    /**
     * @author Ravi Shah
     * This function would render widget on initialization of the widgets
     * @memberof GridStackItemComponent
     */
    ngOnInit() {
        this.RenderWidget(this.option);
    }

    /**
     * @author Ravi Shah
     * Render the widget base on grid stack item
     * @param {GridStackItem} item
     * @memberof GridStackItemComponent
     */
    RenderWidget(item: GridStackItem) {
        const renderer = this.renderer;
        if (item) {
            this.option = item;
        }
        this.renderer.setAttribute(this.nativeElement, 'style', 'margin-left:' + this.option.marginWidth + ';');
        this.renderer.setAttribute(this.nativeElement, 'data-gs-x', String(this.option.x));
        this.renderer.setAttribute(this.nativeElement, 'data-gs-y', String(this.option.y));
        this.renderer.setAttribute(this.nativeElement, 'data-gs-width', String(this.option.width));
        this.renderer.setAttribute(this.nativeElement, 'data-gs-height', String(this.option.height));
        this.renderer.setAttribute(this.nativeElement, 'data-gs-visible', String(this.option.visible));
        this.renderer.setAttribute(this.nativeElement, 'data-gs-title', String(this.option.title));
        this.renderer.setAttribute(this.nativeElement, 'data-gs-key', String(this.option.key));

        let children: any = this.nativeElement.children[0];
        children.style.backgroundColor = this.option.backgroundColor;
        children.style.color = this.option.foregroundColor;
        if (this.option.minWidth) {
            renderer.setAttribute(this.nativeElement, 'data-gs-min-width', String(this.option.minWidth));
        }
        // if (this.option.noResize) {
        renderer.setAttribute(this.nativeElement, 'data-gs-no-resize', 'yes');
        // }
        if (this.option.noMove) {
            renderer.setAttribute(this.nativeElement, 'data-gs-no-move', 'yes');
        }
        if (this.option.locked === true) {
            renderer.setAttribute(this.nativeElement, 'data-gs-locked', 'yes');
        }
    }

    /**
     * Update the Widget Option and Emit the Event
     * @param {number} x X Position of the widget
     * @param {number} y Y Position of the widget
     * @param {number} width Width Position of the widget
     * @param {number} height Height of the widget
     * @param {string} backgroundColor Background color
     * @param {string} foregroundColor Font Color and Icon Color
     * @returns {void}
     * @memberof GridStackItemComponent
     */
    update(x: number, y: number, width: number, height: number, backgroundColor: string, foregroundColor: string): void {
        let a: any = this.nativeElement.children[0];
        a.style.backgroundColor = backgroundColor;
        a.style.color = foregroundColor;
        if (x === this.option.x && y === this.option.y && width === this.option.width && height === this.option.height) {
            return;
        }
        if (this.option != null) {
            this.option.x = x;
            this.option.y = y;
            this.option.width = width;
            this.option.height = height;
            const optionNew = GridStackItem.Clone(this.option);
            this.onGridConfigurationChanged.emit(optionNew);
        }
    }

    /**
     * Destroy the Component reference
     * @memberof GridStackItemComponent
     */
    ngOnDestroy(): void {
        if (this.contentComponentRef !== null) {
            this.contentComponentRef.destroy();
        }
    }
}
