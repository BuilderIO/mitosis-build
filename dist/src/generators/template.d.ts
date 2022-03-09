import { BaseTranspilerOptions, Transpiler } from '../types/config';
export interface ToTemplateOptions extends BaseTranspilerOptions {
}
export declare const componentToTemplate: (options?: ToTemplateOptions) => Transpiler;
