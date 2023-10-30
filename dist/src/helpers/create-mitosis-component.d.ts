import { MitosisComponent } from '../types/mitosis-component';
import { Overwrite, Prettify } from './typescript';
declare type PartialMitosisComponent = Prettify<Overwrite<Partial<MitosisComponent>, {
    hooks: Partial<MitosisComponent['hooks']>;
}>>;
export declare const createMitosisComponent: (options?: PartialMitosisComponent) => MitosisComponent;
export {};
