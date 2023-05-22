import { MitosisContext } from '../types/mitosis-context';
import { MitosisComponent } from '../types/mitosis-component';
interface GetStateObjectStringOptions {
    data?: boolean;
    functions?: boolean;
    getters?: boolean;
    valueMapper?: (code: string, type: 'data' | 'function' | 'getter', typeParameter?: string) => string;
    format?: 'object' | 'class' | 'variables';
    keyPrefix?: string;
}
export declare const getMemberObjectString: (object: MitosisComponent['state'], userOptions?: GetStateObjectStringOptions) => string;
export declare const stringifyContextValue: (object: MitosisContext['value'], userOptions?: GetStateObjectStringOptions) => string;
export declare const getStateObjectStringFromComponent: (component: MitosisComponent, options?: GetStateObjectStringOptions) => string;
export {};
