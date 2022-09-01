import { BaseTranspilerOptions, TranspilerGenerator } from '../../types/transpiler';
export interface ToLitOptions extends BaseTranspilerOptions {
    useShadowDom?: boolean;
}
export declare const componentToLit: TranspilerGenerator<ToLitOptions>;
