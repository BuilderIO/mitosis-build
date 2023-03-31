import * as babel from '@babel/core';
import type { Visitor } from '@babel/traverse';
export declare const babelTransformCode: <VisitorContextType = any>(code: string, visitor?: babel.Visitor<VisitorContextType> | undefined, stripTypes?: boolean) => string;
declare type ExpressionType = 'expression' | 'unknown' | 'block' | 'functionBody';
export declare const babelTransformExpression: <VisitorContextType = any>(code: string, visitor: babel.Visitor<VisitorContextType>, initialType?: ExpressionType, stripTypes?: boolean) => string;
export declare const convertTypeScriptToJS: (code: string) => string;
export {};
