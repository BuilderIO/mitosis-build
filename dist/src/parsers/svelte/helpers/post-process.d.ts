import type { StateValue } from '../../../types/mitosis-component';
import type { SveltosisComponent } from '../types';
declare type SveltosisStateValue = StateValue & {
    arguments?: string[];
    type: string;
};
export declare function preventNameCollissions(json: SveltosisComponent, item: SveltosisStateValue, prepend?: string, append?: string): {
    code: string;
    type: "function" | "getter" | "method" | "property";
    typeParameter?: string | undefined;
    arguments?: string[] | undefined;
};
export declare function postProcess(json: SveltosisComponent): void;
export {};
