import { MitosisContext } from '../../types/mitosis-context';
type ContextToAngularOptions = {
    format?: boolean;
    typescript?: boolean;
};
export declare const contextToAngular: (options?: ContextToAngularOptions) => ({ context }: {
    context: MitosisContext;
}) => string;
export {};
