import * as babel from '@babel/core';
import { JSONOrNode } from '../../types/json';
import { Context } from './types';
/**
 * Parses function declarations within the Mitosis copmonent's body to JSON
 */
export declare const componentFunctionToJson: (node: babel.types.FunctionDeclaration, context: Context) => JSONOrNode;
