import { MitosisNode } from '../types/mitosis-node';
import { BaseTranspilerOptions, Transpiler } from '../types/config';
export interface ToAngularOptions extends BaseTranspilerOptions {
}
interface AngularBlockOptions {
    contextVars?: string[];
    outputVars?: string[];
}
export declare const blockToAngular: (json: MitosisNode, options?: ToAngularOptions, blockOptions?: AngularBlockOptions) => string;
export declare const componentToAngular: (options?: ToAngularOptions) => Transpiler;
export {};
