import { MitosisNode } from '../types/mitosis-node';
import { BaseTranspilerOptions, TranspilerArgs } from '../types/config';
export interface ToVueOptions extends BaseTranspilerOptions {
    vueVersion?: 2 | 3;
    cssNamespace?: () => string;
    namePrefix?: (path: string) => string;
}
export declare const blockToVue: (node: MitosisNode, options: ToVueOptions) => string;
export declare const componentToVue: (userOptions?: ToVueOptions) => ({ component, path }: TranspilerArgs & {
    path: string;
}) => string;
