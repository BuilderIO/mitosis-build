import { MitosisComponent } from '../../../types/mitosis-component';
import { ToSolidOptions } from '../types';
type State = {
    str: string;
    import: {
        store?: string[];
        solidjs?: string[];
    };
};
export declare const getState: ({ json, options, }: {
    json: MitosisComponent;
    options: ToSolidOptions;
}) => State | undefined;
export {};
