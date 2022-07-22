import { MitosisContext } from '../../types/mitosis-context';
declare type ContextToQwikOptions = {
    format?: boolean;
};
export declare const contextToQwik: (options?: ContextToQwikOptions) => ({ context }: {
    context: MitosisContext;
}) => string;
export {};
