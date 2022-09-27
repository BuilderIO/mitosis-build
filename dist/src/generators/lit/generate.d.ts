import { BaseTranspilerOptions, Transpiler } from '../../types/transpiler';
export interface ToLitOptions extends BaseTranspilerOptions {
    useShadowDom?: boolean;
}
export declare const componentToLit: (options?: ToLitOptions) => Transpiler;
