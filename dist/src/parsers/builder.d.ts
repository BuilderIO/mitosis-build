import { BuilderContent, BuilderElement } from '@builder.io/sdk';
import { MitosisNode } from '../types/mitosis-node';
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
    state: any;
};
export declare function convertExportDefaultToReturn(code: string): string;
export declare const createBuilderElement: (options?: Partial<BuilderElement> | undefined) => BuilderElement;
export declare const isBuilderElement: (el: unknown) => el is BuilderElement;
export declare const builderContentToMitosisComponent: (builderContent: BuilderContent, options?: BuilderToMitosisOptions) => {
    subComponents: {
        name: string;
        '@type': "@builder.io/mitosis/component";
        imports: import("..").MitosisImport[];
        meta: import("../types/json").JSONObject & {
            metadataHook?: import("../types/json").JSONObject | undefined;
        };
        inputs: import("..").MitosisComponentInput[];
        state: import("../types/json").JSONObject;
        context: {
            get: {
                [key: string]: {
                    name: string;
                    path: string;
                };
            };
            set: {
                [key: string]: {
                    name: string;
                    value?: import("../types/json").JSONObject | undefined;
                };
            };
        };
        hooks: {
            init?: {
                code: string;
                deps?: string | undefined;
            } | undefined;
            onMount?: {
                code: string;
                deps?: string | undefined;
            } | undefined;
            onUnMount?: {
                code: string;
                deps?: string | undefined;
            } | undefined;
            preComponent?: {
                code: string;
                deps?: string | undefined;
            } | undefined;
            postComponent?: {
                code: string;
                deps?: string | undefined;
            } | undefined;
            onUpdate?: {
                code: string;
                deps?: string | undefined;
            } | undefined;
        };
        children: MitosisNode[];
        subComponents: import("..").MitosisComponent[];
    }[];
    '@type': "@builder.io/mitosis/component";
    name: string;
    imports: import("..").MitosisImport[];
    meta: import("../types/json").JSONObject & {
        metadataHook?: import("../types/json").JSONObject | undefined;
    };
    inputs: import("..").MitosisComponentInput[];
    state: import("../types/json").JSONObject;
    context: {
        get: {
            [key: string]: {
                name: string;
                path: string;
            };
        };
        set: {
            [key: string]: {
                name: string;
                value?: import("../types/json").JSONObject | undefined;
            };
        };
    };
    hooks: {
        init?: {
            code: string;
            deps?: string | undefined;
        } | undefined;
        onMount?: {
            code: string;
            deps?: string | undefined;
        } | undefined;
        onUnMount?: {
            code: string;
            deps?: string | undefined;
        } | undefined;
        preComponent?: {
            code: string;
            deps?: string | undefined;
        } | undefined;
        postComponent?: {
            code: string;
            deps?: string | undefined;
        } | undefined;
        onUpdate?: {
            code: string;
            deps?: string | undefined;
        } | undefined;
    };
    children: MitosisNode[];
};
export {};
