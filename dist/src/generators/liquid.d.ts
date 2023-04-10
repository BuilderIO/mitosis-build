import { BaseTranspilerOptions, TranspilerGenerator } from '../types/transpiler';
export interface ToLiquidOptions extends BaseTranspilerOptions {
    reactive?: boolean;
}
/**
 * Test if the binding expression would be likely to generate
 * valid or invalid liquid. If we generate invalid liquid tags
 * Shopify will reject our PUT to update the template
 */
export declare const isValidLiquidBinding: (str?: string) => boolean;
export declare const componentToLiquid: TranspilerGenerator<ToLiquidOptions>;
