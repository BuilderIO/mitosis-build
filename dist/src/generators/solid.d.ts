import { BaseTranspilerOptions, Transpiler } from '../types/transpiler';
export interface ToSolidOptions extends BaseTranspilerOptions {
    stylesType?: 'styled-components' | 'style-tag';
}
export declare const componentToSolid: (_options?: ToSolidOptions) => Transpiler;
