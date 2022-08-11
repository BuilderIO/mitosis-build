import * as babel from '@babel/core';
import { MitosisComponent } from '../../types/mitosis-component';
import { JSONObject } from '../../types/json';
/**
 * Convert state identifiers from React hooks format to the state.* format Mitosis needs
 * e.g.
 *   text -> state.text
 *   setText(...) -> state.text = ...
 */
export declare function mapReactIdentifiers(json: MitosisComponent): void;
export declare const createFunctionStringLiteralObjectProperty: (key: babel.types.PrivateName | babel.types.Expression, node: babel.types.Node) => babel.types.ObjectProperty;
export declare const parseStateObject: (object: babel.types.ObjectExpression) => JSONObject;
export declare const parseStateObjectToMitosisState: (object: babel.types.ObjectExpression) => import("../../helpers/typescript").Dictionary<import("../../types/mitosis-component").StateValue | undefined>;
