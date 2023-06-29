import * as babel from '@babel/core';
import { MitosisImport } from '../../types/mitosis-component';
import { Context, ParseMitosisOptions } from './types';
declare const types: typeof babel.types;
export declare const mapImportDeclarationToMitosisImport: (node: babel.types.ImportDeclaration) => MitosisImport;
export declare const handleImportDeclaration: ({ options, path, context, }: {
    options: Partial<ParseMitosisOptions>;
    path: babel.NodePath<babel.types.ImportDeclaration>;
    context: Context;
}) => void;
export {};
