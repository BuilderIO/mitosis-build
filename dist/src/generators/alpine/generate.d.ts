import { MitosisNode } from '../../types/mitosis-node';
import { BaseTranspilerOptions, TranspilerGenerator } from '../../types/transpiler';
export interface ToAlpineOptions extends BaseTranspilerOptions {
    /**
     * use @on and : instead of `x-on` and `x-bind`
     */
    useShorthandSyntax?: boolean;
    /**
     * If true, the javascript won't be extracted into a separate script block.
     */
    inlineState?: boolean;
}
export declare const checkIsComponentNode: (node: MitosisNode) => boolean;
/**
 * Test if the binding expression would be likely to generate
 * valid or invalid liquid. If we generate invalid liquid tags
 * Shopify will reject our PUT to update the template
 */
export declare const isValidAlpineBinding: (str?: string) => boolean;
export declare const componentToAlpine: TranspilerGenerator<ToAlpineOptions>;
