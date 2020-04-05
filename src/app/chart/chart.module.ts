/** External import */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
/** Internal import */
import { BarChartComponent } from "./bar-chart/bar-chart.component";

@NgModule({
    imports: [CommonModule],
    declarations: [BarChartComponent],
    exports: [BarChartComponent]
})
export class ChartModule { }