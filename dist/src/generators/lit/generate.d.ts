import { BaseTranspilerOptions, Transpiler } from '../../types/transpiler';
export interface ToLitOptions extends BaseTranspilerOptions {
}
export declare const componentToLit: (options?: ToLitOptions) => Transpiler;
