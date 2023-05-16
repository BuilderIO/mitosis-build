import { BuilderContent, BuilderElement } from '@builder.io/sdk';
import { MitosisNode } from '../types/mitosis-node';
import { BaseTranspilerOptions, TranspilerArgs } from '../types/transpiler';
export interface ToBuilderOptions extends BaseTranspilerOptions {
    includeIds?: boolean;
}
declare type InternalOptions = {
    skipMapper?: boolean;
};
export declare const blockToBuilder: (json: MitosisNode, options?: ToBuilderOptions, _internalOptions?: InternalOptions) => BuilderElement;
export declare const componentToBuilder: (options?: ToBuilderOptions) => ({ component }: TranspilerArgs) => BuilderContent;
export {};
