import { MitosisContext } from '../../types/mitosis-context';
type ContextToSolidOptions = {
    format?: boolean;
};
export declare const contextToSolid: (options?: ContextToSolidOptions) => ({ context }: {
    context: MitosisContext;
}) => string;
export {};
