import { TranspilerGenerator } from '../../types/transpiler';
import { MitosisNode } from '../../types/mitosis-node';
import { ToReactOptions } from './types';
export declare const contextPropDrillingKey = "_context";
export declare const blockToReact: (json: MitosisNode, options: ToReactOptions, parentSlots?: any[]) => string;
export declare const componentToPreact: TranspilerGenerator<ToReactOptions>;
export declare const componentToReact: TranspilerGenerator<ToReactOptions>;
