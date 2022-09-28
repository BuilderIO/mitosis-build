import { MitosisNode } from '../types/mitosis-node';
import { BaseTranspilerOptions, TranspilerGenerator } from '../types/transpiler';
export interface ToAngularOptions extends BaseTranspilerOptions {
    standalone?: boolean;
    preserveImports?: boolean;
}
interface AngularBlockOptions {
    contextVars?: string[];
    outputVars?: string[];
    childComponents?: string[];
    domRefs?: string[];
}
export declare const blockToAngular: (json: MitosisNode, options?: ToAngularOptions, blockOptions?: AngularBlockOptions) => string;
export declare const componentToAngular: TranspilerGenerator<ToAngularOptions>;
export {};
