import { MitosisComponent } from '../types/mitosis-component';
import { MitosisNode } from '../types/mitosis-node';
import { BaseTranspilerOptions, TranspilerGenerator } from '../types/transpiler';
export interface ToMitosisOptions extends BaseTranspilerOptions {
    format: 'react' | 'legacy';
}
export declare const DEFAULT_FORMAT: ToMitosisOptions['format'];
export declare const blockToMitosis: (json: MitosisNode, toMitosisOptions: Partial<ToMitosisOptions> | undefined, component: MitosisComponent) => string;
export declare const componentToMitosis: TranspilerGenerator<Partial<ToMitosisOptions>>;
