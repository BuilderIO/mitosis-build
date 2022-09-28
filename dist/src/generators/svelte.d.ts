import { MitosisComponent } from '../types/mitosis-component';
import { BaseNode, MitosisNode } from '../types/mitosis-node';
import { BaseTranspilerOptions, TranspilerGenerator } from '../types/transpiler';
export interface ToSvelteOptions extends BaseTranspilerOptions {
    stateType?: 'proxies' | 'variables';
}
declare type BlockToSvelte<T extends BaseNode = MitosisNode> = (props: {
    json: T;
    options: ToSvelteOptions;
    parentComponent: MitosisComponent;
}) => string;
export declare const blockToSvelte: BlockToSvelte;
export declare const componentToSvelte: TranspilerGenerator<ToSvelteOptions>;
export {};
