export declare type JSONPrimitive = string | null | number | boolean | undefined;
export declare type JSONObject = {
    [key: string]: _JSON | undefined;
};
/**
 * We use an underscore to avoid collisions with the global `JSON` primitive type.
 */
export declare type _JSON = JSONPrimitive | JSONObject | _JSON[];
export declare type JSONPrimitiveOrNode = JSONPrimitive | babel.Node;
export declare type JSONOrNodeObject = {
    [key: string]: JSONOrNode;
};
export declare type JSONOrNode = JSONPrimitiveOrNode | JSONOrNodeObject | JSONOrNode[];
