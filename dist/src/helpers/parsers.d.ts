import * as babel from '@babel/core';
export declare function parseCode(code: string): babel.types.Statement[];
export declare const isCodeBodyExpression: (body: babel.types.Statement[]) => boolean;
/**
 * Returns `true` if the `code` is a valid expression. (vs a statement)
 */
export declare function isExpression(code: string): boolean;
export declare const isCodeBodyIdentifier: (body: babel.types.Statement[]) => boolean;
