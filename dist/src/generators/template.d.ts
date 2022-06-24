import { BaseTranspilerOptions, Transpiler } from '../types/transpiler';
export interface ToTemplateOptions extends BaseTranspilerOptions {
}
export declare const componentToTemplate: (options?: ToTemplateOptions) => Transpiler;
