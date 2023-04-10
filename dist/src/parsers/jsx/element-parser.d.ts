import * as babel from '@babel/core';
import { MitosisNode } from '../../types/mitosis-node';
declare const types: typeof babel.types;
/**
 * Parses a JSX element into a MitosisNode.
 */
export declare const jsxElementToJson: (node: babel.types.JSXElement | babel.types.JSXText | babel.types.JSXFragment | babel.types.JSXExpressionContainer | babel.types.JSXSpreadChild) => MitosisNode | null;
export {};
