export type JSONPrimitive = string | null | number | boolean | undefined;
export type JSONObject = {
    [key: string]: _JSON | undefined;
};
/**
 * We use an underscore to avoid collisions with the global `JSON` primitive type.
 */
export type _JSON = JSONPrimitive | JSONObject | _JSON[];
export type JSONPrimitiveOrNode = JSONPrimitive | babel.Node;
export type JSONOrNodeObject = {
    [key: string]: JSONOrNode;
};
export type JSONOrNode = JSONPrimitiveOrNode | JSONOrNodeObject | JSONOrNode[];
