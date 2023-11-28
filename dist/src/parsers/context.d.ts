import { MitosisContext } from '../types/mitosis-context';
type ParseContextOptions = {
    name: string;
};
export declare function parseContext(code: string, options: ParseContextOptions): MitosisContext | null;
export {};
