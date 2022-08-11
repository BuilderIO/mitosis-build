import * as babel from '@babel/core';
import { JSONOrNode } from '../../types/json';
export declare const jsonToAst: (json: JSONOrNode) => babel.types.Expression;
