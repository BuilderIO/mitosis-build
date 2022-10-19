import { MitosisComponent } from '../../types/mitosis-component';
import { BaseNode, MitosisNode } from '../../types/mitosis-node';
import { ToSvelteOptions } from './types';
declare type BlockToSvelte<T extends BaseNode = MitosisNode> = (props: {
    json: T;
    options: ToSvelteOptions;
    parentComponent: MitosisComponent;
}) => string;
export declare const blockToSvelte: BlockToSvelte;
export {};
