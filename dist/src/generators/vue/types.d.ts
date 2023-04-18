import { OmitObj } from '../../helpers/typescript';
import { BaseTranspilerOptions } from '../../types/transpiler';
export declare type VueVersion = 2 | 3;
export declare type Api = 'options' | 'composition';
interface VueVersionOpt {
    vueVersion: VueVersion;
}
export interface ToVueOptions extends BaseTranspilerOptions, VueVersionOpt {
    cssNamespace?: () => string;
    namePrefix?: (path: string) => string;
    asyncComponentImports?: boolean;
    defineComponent?: boolean;
    api: Api;
}
export declare type VueOptsWithoutVersion = OmitObj<ToVueOptions, VueVersionOpt>;
export {};
