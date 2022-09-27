import { BaseTranspilerOptions, Transpiler } from '../../types/transpiler';
export interface ToQwikOptions extends BaseTranspilerOptions {
}
export declare const componentToQwik: (userOptions?: ToQwikOptions) => Transpiler;
