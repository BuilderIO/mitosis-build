import * as babel from '@babel/core';
declare const types: typeof babel.types;
export declare const getHook: (node: babel.Node) => babel.types.CallExpression | null;
export declare const processHookCode: (firstArg: babel.types.ArrowFunctionExpression | babel.types.FunctionExpression) => string;
export {};
