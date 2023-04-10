import type { TemplateNode } from 'svelte/types/compiler/interfaces';
export declare function parseText(node: TemplateNode): {
    name: string;
    properties: {
        _text: any;
    };
    '@type': "@builder.io/mitosis/node";
    meta: import("../../../types/json").JSONObject;
    scope: {};
    bindings: {
        [key: string]: import("../../..").Binding | undefined;
    };
    children: import("../../..").MitosisNode[];
} | {
    name: string;
    properties: {
        _text: any;
    };
    '@type': "@builder.io/mitosis/node";
    meta: import("../../../types/json").JSONObject;
    scope: {
        forName: string | undefined;
        indexName: string | undefined;
        collectionName: string | undefined;
    };
    bindings: {
        [key: string]: import("../../..").Binding | undefined;
    };
    children: import("../../..").MitosisNode[];
};
