import { MitosisContext } from '../../types/mitosis-context';
type ContextToRscOptions = {
    format?: boolean;
};
/**
 * React Server Components currently do not support context, so we use
 * plain objects and prop drilling instead.
 */
export declare const contextToRsc: (options?: ContextToRscOptions) => ({ context }: {
    context: MitosisContext;
}) => string;
export {};
