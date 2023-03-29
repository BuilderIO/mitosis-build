/**
 * Same as JSON.stringify, but sorts keys ensuring that the output is stable across runs.
 * @param obj
 * @returns JSON serialized string
 */
export declare function stableJSONserialize(obj: any): string;
