import { BaseTranspilerOptions, TranspilerGenerator } from '../types/transpiler';
export interface ToHtmlOptions extends BaseTranspilerOptions {
    format?: 'class' | 'script';
    prefix?: string;
}
export declare const componentToHtml: TranspilerGenerator<ToHtmlOptions>;
export declare const componentToCustomElement: TranspilerGenerator<ToHtmlOptions>;
