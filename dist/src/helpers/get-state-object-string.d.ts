import { JSONObject } from '../types/json';
import { MitosisComponent } from '../types/mitosis-component';
interface GetStateObjectStringOptions {
    data?: boolean;
    functions?: boolean;
    getters?: boolean;
    valueMapper?: (code: string, type: 'data' | 'function' | 'getter') => string;
    format?: 'object' | 'class' | 'variables';
    keyPrefix?: string;
}
export declare const getMemberObjectString: (object: JSONObject, userOptions?: GetStateObjectStringOptions) => string;
export declare const getStateObjectStringFromComponent: (component: MitosisComponent, options?: GetStateObjectStringOptions) => string;
export {};
