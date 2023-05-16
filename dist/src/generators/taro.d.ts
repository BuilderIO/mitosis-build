import { ClassStyleMap } from '../helpers/styles/helpers';
import { MitosisComponent } from '../types/mitosis-component';
import { TranspilerGenerator } from '../types/transpiler';
import { ToReactOptions } from './react';
export declare const DEFAULT_Component_SET: Set<string>;
export declare type ToTaroOptions = ToReactOptions;
export declare const collectTaroStyles: (json: MitosisComponent) => ClassStyleMap;
export declare const TagMap: Record<string, string>;
export declare const componentToTaro: TranspilerGenerator<Partial<ToTaroOptions>>;
