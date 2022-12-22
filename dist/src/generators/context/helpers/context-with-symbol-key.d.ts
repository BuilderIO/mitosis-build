import { MitosisContext } from '../../../types/mitosis-context';
import { BaseTranspilerOptions } from '../../../types/transpiler';
export declare const getContextWithSymbolKey: (options: Pick<BaseTranspilerOptions, 'prettier'>) => ({ context }: {
    context: MitosisContext;
}) => string;
