import * as babel from '@babel/core';
import { MitosisNode } from '../../types/mitosis-node';
/**
 * Parses a JSX element into a MitosisNode.
 */
export declare const jsxElementToJson: (node: babel.types.JSXElement | babel.types.JSXExpressionContainer | babel.types.JSXFragment | babel.types.JSXText) => MitosisNode | null;
