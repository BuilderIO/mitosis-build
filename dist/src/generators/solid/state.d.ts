import { MitosisComponent } from '../../types/mitosis-component';
import { ToSolidOptions } from './types';
declare type State = {
    str: string;
    import: {
        store?: [string];
        solidjs?: [string];
    };
};
export declare const updateStateCode: ({ options, component, updateSetters, }: {
    options: ToSolidOptions;
    component: MitosisComponent;
    updateSetters?: boolean | undefined;
}) => (value: string) => string;
export declare const getState: ({ json, options, }: {
    json: MitosisComponent;
    options: ToSolidOptions;
}) => State | undefined;
export {};
