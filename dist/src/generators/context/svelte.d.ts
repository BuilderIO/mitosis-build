import { MitosisContext } from '../../types/mitosis-context';
import { BaseTranspilerOptions } from '../../types/transpiler';
interface ContextToSvelteOptions extends Pick<BaseTranspilerOptions, 'prettier'> {
}
/**
 * TO-DO: support types
 */
export declare const contextToSvelte: (options: ContextToSvelteOptions) => ({ context }: {
    context: MitosisContext;
}) => string;
export {};
