import type { StateValue } from '../../../types/mitosis-component';
import type { SveltosisComponent } from '../types';
declare type SveltosisStateValue = StateValue & {
    arguments?: string[];
    type: string;
};
export declare function preventNameCollissions(json: SveltosisComponent, item: SveltosisStateValue): {
    code: string;
    typeParameter?: string | undefined;
    type: "function" | "getter" | "method" | "property";
    propertyType?: import("../../../types/mitosis-component").ReactivityType | undefined;
    arguments?: string[] | undefined;
};
export declare function postProcess(json: SveltosisComponent): void;
export {};
