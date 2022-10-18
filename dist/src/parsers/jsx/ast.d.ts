import * as babel from '@babel/core';
import { JSONOrNode } from '../../types/json';
declare const types: typeof babel.types;
export declare const jsonToAst: (json: JSONOrNode) => babel.types.Expression;
export {};
