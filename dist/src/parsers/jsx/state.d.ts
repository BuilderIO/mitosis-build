import * as babel from '@babel/core';
import { MitosisComponent, MitosisState } from '../../types/mitosis-component';
declare const types: typeof babel.types;
/**
 * Convert state identifiers from React hooks format to the state.* format Mitosis needs
 * e.g.
 *   text -> state.text
 *   setText(...) -> state.text = ...
 */
export declare function mapStateIdentifiers(json: MitosisComponent): void;
export declare const parseStateObjectToMitosisState: (object: babel.types.ObjectExpression, isState?: boolean) => MitosisState;
export {};
