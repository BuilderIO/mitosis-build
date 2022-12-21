import type { SveltosisComponent } from '../types';
export declare function isTypeScriptComponent(string_: string): boolean;
/** Create a tag matching regexp. */
export declare function createTagRegex(tagName: string, flags?: string): RegExp;
/** Transform an attribute string into a key-value object */
export declare function parseAttributes(attributesString: string): Record<string, any>;
export declare function collectTypes(string_: string, json: SveltosisComponent): void;
