import { BuilderContent, BuilderElement } from '@builder.io/sdk';
import { MitosisNode } from '../types/mitosis-node';
import { JSONObject } from '../types/json';
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
export declare const createBuilderElement: (options?: Partial<BuilderElement>) => BuilderElement;
export declare const isBuilderElement: (el: unknown) => el is BuilderElement;
export declare const builderContentToMitosisComponent: (builderContent: BuilderContent, options?: BuilderToMitosisOptions) => {
    subComponents: {
        name: string;
        '@type': "@builder.io/mitosis/component";
        imports: import("..").MitosisImport[];
        exports?: import("..").MitosisExport | undefined;
        meta: JSONObject & {
            useMetadata?: JSONObject | undefined;
        };
        inputs: import("..").MitosisComponentInput[];
        state: import("../helpers/typescript").Dictionary<import("..").StateValue | undefined>;
        context: {
            get: import("..").ContextGet;
            set: import("..").ContextSet;
        };
        refs: {
            [useRef: string]: {
                typeParameter?: string | undefined;
                argument: string;
            };
        };
        hooks: {
            init?: import("..").extendedHook | undefined;
            onInit?: import("..").extendedHook | undefined;
            onMount?: import("..").extendedHook | undefined;
            onUnMount?: import("..").extendedHook | undefined;
            preComponent?: import("..").extendedHook | undefined;
            postComponent?: import("..").extendedHook | undefined;
            onUpdate?: import("..").extendedHook[] | undefined;
        };
        children: MitosisNode[];
        subComponents: import("..").MitosisComponent[];
        types?: string[] | undefined;
        propsTypeRef?: string | undefined;
    }[];
    '@type': "@builder.io/mitosis/component";
    name: string;
    imports: import("..").MitosisImport[];
    exports?: import("..").MitosisExport | undefined;
    meta: JSONObject & {
        useMetadata?: JSONObject | undefined;
    };
    inputs: import("..").MitosisComponentInput[];
    state: import("../helpers/typescript").Dictionary<import("..").StateValue | undefined>;
    context: {
        get: import("..").ContextGet;
        set: import("..").ContextSet;
    };
    refs: {
        [useRef: string]: {
            typeParameter?: string | undefined;
            argument: string;
        };
    };
    hooks: {
        init?: import("..").extendedHook | undefined;
        onInit?: import("..").extendedHook | undefined;
        onMount?: import("..").extendedHook | undefined;
        onUnMount?: import("..").extendedHook | undefined;
        preComponent?: import("..").extendedHook | undefined;
        postComponent?: import("..").extendedHook | undefined;
        onUpdate?: import("..").extendedHook[] | undefined;
    };
    children: MitosisNode[];
    types?: string[] | undefined;
    propsTypeRef?: string | undefined;
};
export {};
