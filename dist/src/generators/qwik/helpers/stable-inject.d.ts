/**
 * Similar to our `stableJSONSerialize` function, except that it does not stringify the values: it injects them as-is.
 * This is needed for our `MitosisState` values which are JS expressions stored as strings.
 */
export declare function stableInject(obj: any): string;
