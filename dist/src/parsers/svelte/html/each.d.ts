import type { TemplateNode } from 'svelte/types/compiler/interfaces';
import type { SveltosisComponent } from '../types';
export declare function parseEach(json: SveltosisComponent, node: TemplateNode): {
    name: string;
    scope: {
        forName: any;
    };
    bindings: {
        each: {
            code: any;
        };
    };
    children: import("../../..").MitosisNode[];
    '@type': "@builder.io/mitosis/node";
    meta: import("../../../types/json").JSONObject;
    properties: {
        [key: string]: string | undefined;
    };
} | {
    name: string;
    scope: {
        forName: any;
    };
    bindings: {
        each: {
            code: any;
        };
    };
    children: import("../../..").MitosisNode[];
    '@type': "@builder.io/mitosis/node";
    meta: import("../../../types/json").JSONObject;
    properties: {
        [key: string]: string | undefined;
    };
};
