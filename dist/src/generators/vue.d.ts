import { MitosisNode } from '../types/mitosis-node';
import { BaseTranspilerOptions } from '../types/transpiler';
import { OmitObj } from '../helpers/typescript';
export declare type VueVersion = 2 | 3;
export declare type Api = 'options' | 'composition';
interface VueVersionOpt {
    vueVersion: VueVersion;
}
export interface ToVueOptions extends BaseTranspilerOptions, VueVersionOpt {
    cssNamespace?: () => string;
    namePrefix?: (path: string) => string;
    asyncComponentImports?: boolean;
    api?: Api;
}
declare type BlockRenderer = (json: MitosisNode, options: ToVueOptions, scope?: Scope) => string;
interface Scope {
    isRootNode?: boolean;
}
export declare const blockToVue: BlockRenderer;
declare type VueOptsWithoutVersion = OmitObj<ToVueOptions, VueVersionOpt>;
export declare const componentToVue2: (vueOptions?: VueOptsWithoutVersion) => import("../types/transpiler").Transpiler<string>;
export declare const componentToVue3: (vueOptions?: VueOptsWithoutVersion) => import("../types/transpiler").Transpiler<string>;
export {};
