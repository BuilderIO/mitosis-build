import { MitosisNode } from '../../types/mitosis-node';
import { TranspilerGenerator } from '../../types/transpiler';
import { AngularBlockOptions, ToAngularOptions } from './types';
export declare const blockToAngular: (json: MitosisNode, options?: ToAngularOptions, blockOptions?: AngularBlockOptions) => string;
export declare const componentToAngular: TranspilerGenerator<ToAngularOptions>;
