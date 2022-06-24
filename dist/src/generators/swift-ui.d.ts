import { Transpiler } from '../types/transpiler';
export declare type ToSwiftOptions = {
    prettier?: boolean;
};
export declare const componentToSwift: (options?: ToSwiftOptions) => Transpiler;
