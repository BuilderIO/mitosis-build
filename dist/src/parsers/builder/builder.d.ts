import { MitosisComponent, MitosisState } from '../../types/mitosis-component';
import { BuilderContent, BuilderElement } from '@builder.io/sdk';
import { MitosisNode } from '../../types/mitosis-node';
type InternalOptions = {
    skipMapper?: boolean;
};
export declare const symbolBlocksAsChildren = false;
type BuilderToMitosisOptions = {
    context?: {
        [key: string]: any;
    };
    includeBuilderExtras?: boolean;
    preserveTextBlocks?: boolean;
    includeSpecialBindings?: boolean;
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
