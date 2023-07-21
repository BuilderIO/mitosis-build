import { MitosisComponent } from '../types/mitosis-component';
import { MitosisContext } from '../types/mitosis-context';
declare type ValueMapper = (code: string, type: 'data' | 'function' | 'getter', typeParameter: string | undefined, key: string | undefined) => string;
interface GetStateObjectStringOptions {
    data?: boolean;
    functions?: boolean;
    getters?: boolean;
    valueMapper?: ValueMapper;
    format?: 'object' | 'class' | 'variables';
    keyPrefix?: string;
}
export declare const getMemberObjectString: (object: MitosisComponent['state'], userOptions?: GetStateObjectStringOptions) => string;
export declare const stringifyContextValue: (object: MitosisContext['value'], userOptions?: GetStateObjectStringOptions) => string;
export declare const getStateObjectStringFromComponent: (component: MitosisComponent, options?: GetStateObjectStringOptions) => string;
export {};
