import * as babel from '@babel/core';
import { MitosisImport } from '../types/mitosis-component';
declare const types: typeof babel.types;
export declare const mapImportDeclarationToMitosisImport: (node: babel.types.ImportDeclaration) => MitosisImport;
export {};
