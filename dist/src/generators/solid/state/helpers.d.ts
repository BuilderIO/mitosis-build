import { MitosisComponent } from '../../../types/mitosis-component';
import { ToSolidOptions } from '../types';
export declare const getStateSetterName: (stateName: string) => string;
export declare const getStateTypeForValue: ({ value, component, options, }: {
    value: string;
    component: MitosisComponent;
    options: ToSolidOptions;
}) => import("../types").SolidState;
export declare const updateStateCode: ({ options, component, updateSetters, }: {
    options: ToSolidOptions;
    component: MitosisComponent;
    updateSetters?: boolean | undefined;
}) => (value: string) => string;
