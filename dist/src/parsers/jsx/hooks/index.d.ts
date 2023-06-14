import * as babel from '@babel/core';
import { MitosisComponent } from '../../../types/mitosis-component';
import { ParseMitosisOptions } from '../types';
declare const types: typeof babel.types;
export declare function parseDefaultPropsHook(component: MitosisComponent, expression: babel.types.CallExpression): void;
export declare function generateUseStyleCode(expression: babel.types.CallExpression): string;
/**
 * Transform useMetadata({...}) onto the component JSON as
 * meta: { metadataHook: { ... }}
 *
 * This function collects metadata and removes the statement from
 * the returned nodes array
 */
export declare const collectModuleScopeHooks: (component: MitosisComponent, options: ParseMitosisOptions) => (nodes: babel.types.Statement[]) => babel.types.Statement[];
export {};
