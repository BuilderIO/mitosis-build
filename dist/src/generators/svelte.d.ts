import { MitosisNode } from '../types/mitosis-node';
import { BaseTranspilerOptions, Transpiler } from '../types/config';
export interface ToSvelteOptions extends BaseTranspilerOptions {
    stateType?: 'proxies' | 'variables';
}
export declare const blockToSvelte: (json: MitosisNode, options: ToSvelteOptions) => string;
export declare const componentToSvelte: (options?: ToSvelteOptions) => Transpiler;
