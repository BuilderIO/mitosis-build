import * as babel from '@babel/core';
import { MitosisComponent } from '../types/mitosis-component';
export declare const selfClosingTags: Set<string>;
export declare const createFunctionStringLiteral: (node: babel.types.Node) => babel.types.StringLiteral;
export declare const createFunctionStringLiteralObjectProperty: (key: babel.types.PrivateName | babel.types.Expression, node: babel.types.Node) => babel.types.ObjectProperty;
export declare const parseStateObject: (object: babel.types.ObjectExpression) => any;
export declare const METADATA_HOOK_NAME = "useMetadata";
declare type ParseMitosisOptions = {
    format: 'react' | 'simple';
    jsonHookNames?: string[];
};
/**
 * This function takes the raw string from a Mitosis component, and converts it into a JSON that can be processed by
 * each generator function.
 *
 * @param jsx string representation of the Mitosis component
 * @returns A JSON representation of the Mitosis component
 */
export declare function parseJsx(jsx: string, options?: Partial<ParseMitosisOptions>): MitosisComponent;
export {};
