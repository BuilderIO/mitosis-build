import * as babel from '@babel/core';
import { Context } from './types';
declare const types: typeof babel.types;
export declare const getPropsTypeRef: (node: babel.types.FunctionDeclaration, context: Context) => string | undefined;
export declare const isTypeOrInterface: (node: babel.Node) => boolean;
import { NodePath as BabelTraverseNodePath } from '@babel/traverse';
export declare const collectTypes: (path: BabelTraverseNodePath<babel.types.TSTypeAliasDeclaration> | BabelTraverseNodePath<babel.types.ExportNamedDeclaration> | BabelTraverseNodePath<babel.types.TSInterfaceDeclaration> | BabelTraverseNodePath<babel.types.TSTypeAliasDeclaration>, context: Context) => void;
export {};
