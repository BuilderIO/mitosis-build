import { Transpiler } from '..';
import { MitosisNode } from '../types/mitosis-node';
export interface ToMitosisOptions {
    prettier?: boolean;
    format: 'react' | 'legacy';
}
export declare const DEFAULT_FORMAT: ToMitosisOptions['format'];
export declare const blockToMitosis: (json: MitosisNode, toMitosisOptions?: Partial<ToMitosisOptions>) => string;
export declare const componentToMitosis: (toMitosisOptions?: Partial<ToMitosisOptions>) => Transpiler;
