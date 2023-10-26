import { MitosisComponent } from '../types/mitosis-component';
import { TranspilerGenerator } from '../types/transpiler';
import { ToReactOptions } from './react';
export declare type ToRscOptions = ToReactOptions;
export declare const checkIfIsClientComponent: (json: MitosisComponent) => boolean;
export declare const componentToRsc: TranspilerGenerator<Partial<ToRscOptions>>;
