import { JSONObject } from '../types/json';
import { MitosisComponent } from '../types/mitosis-component';
export declare type GetStateObjectStringOptions = {
    data?: boolean;
    functions?: boolean;
    getters?: boolean;
    valueMapper?: (code: string, type: 'data' | 'function' | 'getter') => string;
    format?: 'object' | 'class' | 'variables';
    keyPrefix?: string;
};
export declare const getMemberObjectString: (object: JSONObject, options?: GetStateObjectStringOptions) => string;
export declare const getStateObjectStringFromComponent: (component: MitosisComponent, options?: GetStateObjectStringOptions) => string;
