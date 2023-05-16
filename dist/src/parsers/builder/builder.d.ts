import { BuilderContent, BuilderElement } from '@builder.io/sdk';
import { MitosisComponent, MitosisState } from '../..';
import { MitosisNode } from '../../types/mitosis-node';
declare type InternalOptions = {
    skipMapper?: boolean;
};
export declare const symbolBlocksAsChildren = false;
export declare type BuilderToMitosisOptions = {
    context?: {
        [key: string]: any;
    };
    includeBuilderExtras?: boolean;
    preserveTextBlocks?: boolean;
};
export declare type InternalBuilderToMitosisOptions = BuilderToMitosisOptions & {
    context: {
        [key: string]: any;
    };
};
export declare const builderElementToMitosisNode: (block: BuilderElement, options: BuilderToMitosisOptions, _internalOptions?: InternalOptions) => MitosisNode;
/**
 * Take Builder custom jsCode and extract the contents of the useState hook
 * and return it as a JS object along with the inputted code with the hook
 * code extracted
 */
export declare function extractStateHook(code: string): {
    code: string;
    state: MitosisState;
};
export declare function convertExportDefaultToReturn(code: string): string;
export declare const createBuilderElement: (options?: Partial<BuilderElement>) => BuilderElement;
export declare const isBuilderElement: (el: unknown) => el is BuilderElement;
export declare const builderContentToMitosisComponent: (builderContent: BuilderContent, options?: BuilderToMitosisOptions) => MitosisComponent;
export {};
