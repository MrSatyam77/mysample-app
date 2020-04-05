import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
    selector: 'app-price-list-preview',
    templateUrl: './price-list-preview.component.html',
    styleUrls: ['./price-list-preview.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class PriceListPreviewComponent {
    @Input() priceListDetail: any;
}
