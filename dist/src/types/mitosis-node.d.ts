import { JSONObject } from './json';
export declare type MitosisNode = {
    '@type': '@builder.io/mitosis/node';
    name: string;
    meta: JSONObject;
    properties: {
        [key: string]: string | undefined;
    };
    bindings: {
        [key: string]: string | undefined;
    };
    children: MitosisNode[];
};
