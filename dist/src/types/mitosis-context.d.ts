import { ContextOptions, MitosisState } from './mitosis-component';
export declare type MitosisContext = ContextOptions & {
    '@type': '@builder.io/mitosis/context';
    name: string;
    value: MitosisState;
};
