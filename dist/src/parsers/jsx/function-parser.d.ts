import * as babel from '@babel/core';
import { JSONOrNode } from '../../types/json';
import { MitosisComponent } from '../../types/mitosis-component';
import { Context } from './types';
declare const types: typeof babel.types;
export declare function generateUseStyleCode(expression: babel.types.CallExpression): string;
export declare function parseDefaultPropsHook(component: MitosisComponent, expression: babel.types.CallExpression): void;
/**
 * Parses function declarations within the Mitosis copmonent's body to JSON
 */
export declare const componentFunctionToJson: (node: babel.types.FunctionDeclaration, context: Context) => JSONOrNode;
export {};
