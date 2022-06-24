import { BaseTranspilerOptions, Transpiler } from '../../types/transpiler';
export interface ToStencilOptions extends BaseTranspilerOptions {
}
export declare const componentToStencil: (options?: ToStencilOptions) => Transpiler;
