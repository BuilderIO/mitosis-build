import { MitosisComponent } from '../types/mitosis-component';
import { MitosisNode } from '../types/mitosis-node';
import { BaseTranspilerOptions, Transpiler } from '../types/transpiler';
export interface ToSvelteOptions extends BaseTranspilerOptions {
    stateType?: 'proxies' | 'variables';
}
interface BlockToSvelteProps {
    json: MitosisNode;
    options: ToSvelteOptions;
    parentComponent: MitosisComponent;
}
declare type BlockToSvelte = (props: BlockToSvelteProps) => string;
export declare const blockToSvelte: BlockToSvelte;
export declare const componentToSvelte: ({ plugins, ...userProvidedOptions }?: ToSvelteOptions) => Transpiler;
export {};
