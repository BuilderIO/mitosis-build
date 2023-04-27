import { MitosisContext } from '../../types/mitosis-context';
declare type ContextToReactOptions = {
    format?: boolean;
    typescript?: boolean;
};
export declare const contextToReact: (options?: ContextToReactOptions) => ({ context }: {
    context: MitosisContext;
}) => string;
export {};
