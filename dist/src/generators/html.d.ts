import { BaseTranspilerOptions, Transpiler } from '../types/config';
export interface ToHtmlOptions extends BaseTranspilerOptions {
    format?: 'class' | 'script';
    prefix?: string;
}
export declare const componentToHtml: (options?: ToHtmlOptions) => Transpiler;
export declare const componentToCustomElement: (options?: ToHtmlOptions) => Transpiler;
