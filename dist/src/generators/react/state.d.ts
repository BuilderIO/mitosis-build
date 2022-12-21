import { MitosisComponent } from '../../types/mitosis-component';
import { ToReactOptions } from './types';
export declare const processHookCode: ({ str, options }: {
    str: string;
    options: ToReactOptions;
}) => string;
export declare const getUseStateCode: (json: MitosisComponent, options: ToReactOptions) => string;
export declare const updateStateSetters: (json: MitosisComponent, options: ToReactOptions) => void;
export declare const updateStateSettersInCode: (value: string, options: ToReactOptions) => string;
