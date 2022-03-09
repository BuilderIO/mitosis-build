import { MitosisNode } from '../types/mitosis-node';
import { BaseTranspilerOptions, Transpiler } from '../types/config';
export interface ToAngularOptions extends BaseTranspilerOptions {
}
export declare const blockToAngular: (json: MitosisNode, options?: ToAngularOptions) => string;
export declare const componentToAngular: (options?: ToAngularOptions) => Transpiler;
