import { BaseTranspilerOptions, TranspilerGenerator } from '../../types/transpiler';
export interface ToMarkoOptions extends BaseTranspilerOptions {
}
export declare const componentToMarko: TranspilerGenerator<ToMarkoOptions>;
/**
 * Convert marko expressions to valid html
 *
 * <div on-click=(() => doSomething())> -> <div on-click="() => doSomething()">
 */
export declare function preprocessHtml(htmlString: string): string;
/**
 * Convert HTML back to marko expressions
 *
 * <div on-click="() => doSomething()"> -> <div on-click=(() => doSomething())>
 */
export declare function postprocessHtml(htmlString: string): string;
/**
 * Format Marko HTML using the built-in HTML parser for prettier,
 * given issues with Marko's plugin
 */
export declare function markoFormatHtml(htmlString: string): string;
