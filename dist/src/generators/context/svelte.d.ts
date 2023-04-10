import { BaseTranspilerOptions } from '../../types/transpiler';
/**
 * TO-DO: support types
 */
export declare const contextToSvelte: (options: Pick<BaseTranspilerOptions, "prettier">) => ({ context }: {
    context: import("../../types/mitosis-context").MitosisContext;
}) => string;
