import { MitosisNode } from '../types/mitosis-node';
import { BaseTranspilerOptions, TranspilerGenerator } from '../types/transpiler';
export interface ToAngularOptions extends BaseTranspilerOptions {
    standalone?: boolean;
    preserveImports?: boolean;
    preserveFileExtensions?: boolean;
    importMapper?: Function;
    bootstrapMapper?: Function;
}
interface AngularBlockOptions {
    childComponents?: string[];
}
export declare const blockToAngular: (json: MitosisNode, options?: ToAngularOptions, blockOptions?: AngularBlockOptions) => string;
export declare const componentToAngular: TranspilerGenerator<ToAngularOptions>;
export {};
