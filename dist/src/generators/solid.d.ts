import { BaseTranspilerOptions, Transpiler } from '../types/config';
export interface ToSolidOptions extends BaseTranspilerOptions {
}
export declare const componentToSolid: (options?: ToSolidOptions) => Transpiler;
