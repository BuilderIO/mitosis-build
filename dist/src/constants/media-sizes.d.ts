export type Size = 'large' | 'medium' | 'small';
export declare const sizeNames: Size[];
export declare const sizes: {
    small: {
        min: number;
        default: number;
        max: number;
    };
    medium: {
        min: number;
        default: number;
        max: number;
    };
    large: {
        min: number;
        default: number;
        max: number;
    };
    getWidthForSize(size: Size): number;
    getSizeForWidth(width: number): Size;
};
export declare const mediaQueryRegex: RegExp;
