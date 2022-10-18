import * as babel from '@babel/core';
import { MitosisExport } from '../../types/mitosis-component';
declare const types: typeof babel.types;
export declare const generateExports: (path: babel.NodePath<babel.types.Program>) => MitosisExport;
export {};
