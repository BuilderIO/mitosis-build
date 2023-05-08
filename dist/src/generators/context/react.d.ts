import { MitosisContext } from '../../types/mitosis-context';
declare type ContextToReactOptions = {
    format?: boolean;
    preact?: boolean;
    typescript?: boolean;
};
export declare const contextToReact: (options?: ContextToReactOptions) => ({ context }: {
    context: MitosisContext;
}) => string;
export {};
