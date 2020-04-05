/** Barchart config interface */
export interface IBarChart {
    data?: any;//json data
    xProperty?: IAxisPropertyOption;
    yProperties?: IAxisPropertyOption[];
    baseLineColor?: string;
    showXAxis?: boolean;
    fontSize?: number;
    fontName?: string;
    ticks?: number;
    height?: number;
    width?: number;
    noDataMessage: string;
    options?: IOptions;
}
/** Property for x and y axis */
export interface IAxisPropertyOption {
    filedName: string;
    barColor?: string;
}

/** Default Value */
export enum DEFAULT_VALUE {
    FONTSIZE = 11,
    FOR_COLOR = '#ACACAC',
    BASE_LINE_COLOR = "#ddd",
    FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
    BACKGROUND_COLOR = "#FFFFFF",
    CHART_HEIGHT = 225,
    BASE_LINE_WIDTH = 2,
    PADDING_TOP = 25,
    PADDING_BOTTOM = 10,
    TICKS = 4,
    NO_DATA_FOUND = "No data found",
    HEADER_FONTNAME = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
    HEADER_FONTSIZE = 18,
    HEADER_FORCOLOR = "#b1b1b1"
}

/** Settings */
export class ISettings {
    paddingLeft: number;
    paddingRight: number;
    paddingTop: number;
    paddingBottom: number;
    yStepsize?: number;
    xStepSize?: number;
    canvas?: HTMLCanvasElement;
    context?: any;
    height?: number;
    width?: number;
    yMax?: number;
    yMin?: number;
    yStep?: number;
    yMaxValueWidth?: number;//text width of y max value like Max is '100' then get length of '100'.length
    chartData?: any;
    location?: any;
    areaHeight?: number;
    areaWidth?: number;
}

/** Options */
export class IOptions {
    header?: {
        text: string,
        fontSize?: number
        fontName?: string;
        color?: string;
        show?: boolean;
    }
}