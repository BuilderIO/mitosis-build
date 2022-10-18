import * as babel from '@babel/core';
import { MitosisComponent } from '../../types/mitosis-component';
import { JSONObject } from '../../types/json';
declare const types: typeof babel.types;
/**
 * Convert state identifiers from React hooks format to the state.* format Mitosis needs
 * e.g.
 *   text -> state.text
 *   setText(...) -> state.text = ...
 */
export declare function mapStateIdentifiers(json: MitosisComponent): void;
export declare const parseStateObject: (object: babel.types.ObjectExpression) => JSONObject;
export declare const parseStateObjectToMitosisState: (object: babel.types.ObjectExpression) => import("../../types/mitosis-component").MitosisState;
export {};
