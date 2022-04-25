import { MitosisContext } from '../../types/mitosis-context';
import { BaseTranspilerOptions } from '../../types/config';
interface ContextToSvelteOptions extends Pick<BaseTranspilerOptions, 'prettier'> {
}
export declare const contextToSvelte: (options?: ContextToSvelteOptions) => ({ context }: {
    context: MitosisContext;
}) => string;
export {};
