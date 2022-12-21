import * as babel from '@babel/core';
import { Context, ParseMitosisOptions } from './types';
declare const types: typeof babel.types;
export declare const handleImportDeclaration: ({ options, path, context, }: {
    options: Partial<ParseMitosisOptions>;
    path: babel.NodePath<babel.types.ImportDeclaration>;
    context: Context;
}) => void;
export {};
