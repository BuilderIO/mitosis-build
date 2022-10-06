import { OmitObj } from '../../helpers/typescript';
import { ToVueOptions, VueVersionOpt } from './types';
declare type VueOptsWithoutVersion = OmitObj<ToVueOptions, VueVersionOpt>;
export declare const componentToVue2: (vueOptions?: VueOptsWithoutVersion) => import("../../types/transpiler").Transpiler<string>;
export declare const componentToVue3: (vueOptions?: VueOptsWithoutVersion) => import("../../types/transpiler").Transpiler<string>;
export {};
