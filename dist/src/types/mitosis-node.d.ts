import { JSONObject } from './json';
export declare type SpreadType = 'normal' | 'event-handlers';
declare type BindingProperties = {
    type: 'spread';
    spreadType: SpreadType;
} | {
    type: 'single';
};
export declare type Binding = {
    code: string;
    arguments?: string[];
} & BindingProperties;
export declare type BaseNode = {
    '@type': '@builder.io/mitosis/node';
    meta: JSONObject;
    name: string;
    scope: {};
    /**
     * Key-value store of string values for DOM attributes.
     * ```js
     * {
     *   defaultValue: 'initial text',
     *   width: '100px',
     * }
     * ```
     */
    properties: {
        [key: string]: string | undefined;
    };
    /**
     * Key-value store of expression values for DOM attributes. These are always represented as strings.
     *
     * ```js
     * {
     *   disabled: "state.isDisabled",
     *   defaultValue: "`${props.text} + ' initial'`",
     *   width: "props.width * 10",
     *   height: "100",
     * }
     * ```
     */
    bindings: {
        [key: string]: Binding | undefined;
    };
    children: MitosisNode[];
};
export declare type SpecialNodesNames = 'For' | 'Fragment' | 'Show' | 'Slot';
export declare type ForNode = BaseNode & {
    name: 'For';
    scope: {
        forName: string | undefined;
        indexName: string | undefined;
        collectionName: string | undefined;
    };
};
export declare type MitosisNode = BaseNode | ForNode;
export declare const checkIsForNode: (node: MitosisNode) => node is ForNode;
export {};
