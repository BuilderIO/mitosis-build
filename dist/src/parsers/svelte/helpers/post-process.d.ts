import type { SveltosisComponent } from '../types';
export declare function preventNameCollissions(json: SveltosisComponent, input: string, arguments_: string[], prepend?: string, append?: string): {
    code: string;
    arguments: string[];
} | {
    code: string;
    arguments?: undefined;
};
export declare function postProcess(json: SveltosisComponent): void;
