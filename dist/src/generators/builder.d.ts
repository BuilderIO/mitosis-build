import { MitosisNode } from '../types/mitosis-node';
import { BuilderElement } from '@builder.io/sdk';
import { TranspilerArgs } from '../types/config';
export interface ToBuilderOptions {
    includeIds?: boolean;
}
declare type InternalOptions = {
    skipMapper?: boolean;
};
export declare const blockToBuilder: (json: MitosisNode, options?: ToBuilderOptions, _internalOptions?: InternalOptions) => BuilderElement;
export declare const componentToBuilder: (options?: ToBuilderOptions) => ({ component }: TranspilerArgs) => {
    data: {
        httpRequests: import("../types/json").JSON;
        jsCode: string;
        tsCode: string;
        blocks: BuilderElement[];
    };
};
export {};
