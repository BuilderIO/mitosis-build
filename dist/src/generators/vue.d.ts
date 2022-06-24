import { MitosisNode } from '../types/mitosis-node';
import { BaseTranspilerOptions, Transpiler } from '../types/transpiler';
import { OmitObj } from '../helpers/typescript';
export declare type VueVersion = 2 | 3;
interface VueVersionOpt {
    vueVersion: VueVersion;
}
export interface ToVueOptions extends BaseTranspilerOptions, VueVersionOpt {
    cssNamespace?: () => string;
    namePrefix?: (path: string) => string;
    asyncComponentImports?: boolean;
}
export declare const blockToVue: (node: MitosisNode, options: ToVueOptions) => string;
declare type VueOptsWithoutVersion = OmitObj<ToVueOptions, VueVersionOpt>;
export declare const componentToVue2: (vueOptions?: VueOptsWithoutVersion) => Transpiler;
export declare const componentToVue3: (vueOptions?: VueOptsWithoutVersion) => Transpiler;
export {};
