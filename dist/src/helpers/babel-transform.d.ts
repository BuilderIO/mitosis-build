import * as babel from '@babel/core';
declare type Visitor<ContextType = any> = {
    [key: string]: (path: any, context: ContextType) => void;
};
export declare const babelTransform: <VisitorContextType = any>(code: string, visitor: Visitor<VisitorContextType>) => babel.BabelFileResult | null;
export declare const babelTransformCode: <VisitorContextType = any>(code: string, visitor: Visitor<VisitorContextType>) => string;
export declare const babelTransformExpression: <VisitorContextType = any>(code: string, visitor: Visitor<VisitorContextType>, type?: 'expression' | 'unknown' | 'block' | 'functionBody') => string;
export {};
