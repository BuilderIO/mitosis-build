import { BaseTranspilerOptions } from '../../types/transpiler';
export declare type ToSvelteOptions = BaseTranspilerOptions & {
    stateType?: 'proxies' | 'variables';
};
