import { MitosisContext } from '../../types/mitosis-context';
declare type ContextToReactOptions = {
    format?: boolean;
};
export declare const contextToReact: (options?: ContextToReactOptions) => ({ context }: {
    context: MitosisContext;
}) => string;
export {};
