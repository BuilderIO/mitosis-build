import { Transpiler } from '..';
export declare type ToSwiftOptions = {
    prettier?: boolean;
};
export declare const componentToSwift: (options?: ToSwiftOptions) => Transpiler;
