import { BaseTranspilerOptions, TranspilerGenerator } from '../types/transpiler';
import { MitosisNode } from '../types/mitosis-node';
export interface ToMitosisOptions extends BaseTranspilerOptions {
    format: 'react' | 'legacy';
}
export declare const DEFAULT_FORMAT: ToMitosisOptions['format'];
export declare const blockToMitosis: (json: MitosisNode, toMitosisOptions?: Partial<ToMitosisOptions>) => string;
export declare const componentToMitosis: TranspilerGenerator<Partial<ToMitosisOptions>>;
