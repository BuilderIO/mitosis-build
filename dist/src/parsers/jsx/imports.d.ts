import * as babel from '@babel/core';
import { Context, ParseMitosisOptions } from './types';
export declare const handleImportDeclaration: ({ options, path, context, }: {
    options: Partial<ParseMitosisOptions>;
    path: babel.NodePath<babel.types.ImportDeclaration>;
    context: Context;
}) => void;
