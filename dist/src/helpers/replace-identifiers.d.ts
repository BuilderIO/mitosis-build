import { types } from '@babel/core';
export declare type ReplaceTo = string | ((accessedProperty: string, matchedIdentifier: string) => string) | null;
declare type ReplaceArgs = {
    code: string;
    from: string | string[];
    to: ReplaceTo;
};
/**
 * @deprecated Use `replaceNodes` instead.
 */
export declare const replaceIdentifiers: ({ code, from, to }: ReplaceArgs) => string;
export declare const replaceStateIdentifier: (to: ReplaceArgs['to']) => (code: string) => string;
export declare const replacePropsIdentifier: (to: ReplaceArgs['to']) => (code: string) => string;
/**
 * Replaces all instances of a Babel AST Node with a new Node within a code string.
 * Uses `generate()` to convert the Node to a string and compare them.
 */
export declare const replaceNodes: ({ code, nodeMaps, }: {
    code: string;
    nodeMaps: {
        from: types.Node;
        condition?: ((path: babel.NodePath<types.Node>) => boolean) | undefined;
        to: types.Node;
    }[];
}) => string;
export {};
