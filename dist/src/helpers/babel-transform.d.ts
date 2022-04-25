import * as babel from '@babel/core';
import type { Visitor } from '@babel/traverse';
export declare const babelTransform: <VisitorContextType = any>(code: string, visitor?: babel.Visitor<VisitorContextType> | undefined) => babel.BabelFileResult | null;
export declare const babelTransformCode: <VisitorContextType = any>(code: string, visitor?: babel.Visitor<VisitorContextType> | undefined) => string;
export declare const babelTransformExpression: <VisitorContextType = any>(code: string, visitor: babel.Visitor<VisitorContextType>, type?: 'expression' | 'unknown' | 'block' | 'functionBody') => string;
