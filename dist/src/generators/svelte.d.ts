import { MitosisComponent } from '../types/mitosis-component';
import { MitosisNode } from '../types/mitosis-node';
import { BaseTranspilerOptions, Transpiler } from '../types/config';
export interface ToSvelteOptions extends BaseTranspilerOptions {
    stateType?: 'proxies' | 'variables';
}
interface BlockToSvelteProps {
    json: MitosisNode;
    options: ToSvelteOptions;
    parentComponent?: MitosisComponent;
}
export declare const blockToSvelte: ({ json, options, parentComponent, }: BlockToSvelteProps) => string;
export declare const componentToSvelte: (options?: ToSvelteOptions) => Transpiler;
export {};
