import * as babel from '@babel/core';
import { Context } from './types';
export declare const getPropsTypeRef: (node: babel.types.FunctionDeclaration, context: Context) => string | undefined;
export declare const isTypeOrInterface: (node: babel.Node) => boolean;
export declare const collectTypes: (node: babel.Node, context: Context) => void;
export declare function handleTypeImports(path: babel.NodePath<babel.types.Program>, context: Context): void;
