export declare type JSONPrimitive = string | null | number | boolean | undefined;
export declare type JSONObject = {
    [key: string]: JSON | undefined;
};
export declare type JSON = JSONPrimitive | JSONObject | JSON[];
export declare type JSONPrimitiveOrNode = JSONPrimitive | babel.Node;
export declare type JSONOrNodeObject = {
    [key: string]: JSONOrNode;
};
export declare type JSONOrNode = JSONPrimitiveOrNode | JSONOrNodeObject | JSONOrNode[];
