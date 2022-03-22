import { BaseTranspilerOptions, Transpiler } from '../../types/config';
export interface ToStencilOptions extends BaseTranspilerOptions {
}
export declare const componentToStencil: (options?: ToStencilOptions) => Transpiler;
