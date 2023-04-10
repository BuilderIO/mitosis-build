import { MitosisComponent } from '../../types/mitosis-component';
import { ToSvelteOptions } from './types';
export declare const stripStateAndProps: ({ options, json }: {
    options: ToSvelteOptions;
    json: MitosisComponent;
}) => (code: string) => string;
