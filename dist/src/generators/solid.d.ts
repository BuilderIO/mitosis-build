import { BaseTranspilerOptions, Transpiler } from '../types/transpiler';
export interface ToSolidOptions extends BaseTranspilerOptions {
}
export declare const componentToSolid: (options?: ToSolidOptions) => Transpiler;
