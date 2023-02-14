import { ClassStyleMap } from '../helpers/styles/helpers';
import { MitosisComponent } from '../types/mitosis-component';
import { BaseTranspilerOptions, TranspilerGenerator } from '../types/transpiler';
export declare const DEFAULT_Component_SET: Set<string>;
export interface ToTaroOptions extends BaseTranspilerOptions {
    stateType?: 'useState' | 'mobx' | 'valtio' | 'solid' | 'builder';
}
export declare const collectTaroStyles: (json: MitosisComponent) => ClassStyleMap;
export declare const TagMap: Record<string, string>;
export declare const componentToTaro: TranspilerGenerator<ToTaroOptions>;
