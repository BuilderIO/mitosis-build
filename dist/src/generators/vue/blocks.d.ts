import { MitosisNode } from '../../types/mitosis-node';
import { ToVueOptions } from './types';
declare type BlockRenderer = (json: MitosisNode, options: ToVueOptions, scope?: Scope) => string;
interface Scope {
    isRootNode?: boolean;
}
export declare const blockToVue: BlockRenderer;
export {};
