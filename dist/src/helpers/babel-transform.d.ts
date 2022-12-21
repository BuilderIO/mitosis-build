import * as babel from '@babel/core';
import type { Visitor } from '@babel/traverse';
export declare const babelTransform: <VisitorContextType = any>(code: string, visitor?: babel.Visitor<VisitorContextType> | undefined) => babel.BabelFileResult | null;
export declare const babelTransformCode: <VisitorContextType = any>(code: string, visitor?: babel.Visitor<VisitorContextType> | undefined) => string;
declare type ExpressionType = 'expression' | 'unknown' | 'block' | 'functionBody';
export declare const babelTransformExpression: <VisitorContextType = any>(code: string, visitor: babel.Visitor<VisitorContextType>, initialType?: ExpressionType) => string;
export {};
