import { Transpiler } from '../../types/transpiler';
import { MitosisNode } from '../../types/mitosis-node';
import { ToReactOptions } from './types';
export declare const blockToReact: (json: MitosisNode, options: ToReactOptions, parentSlots?: any[]) => string;
export declare const componentToPreact: (reactOptions?: ToReactOptions) => Transpiler;
export declare const componentToReact: (reactOptions?: ToReactOptions) => Transpiler;
