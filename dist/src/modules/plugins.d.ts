import { MitosisComponent } from '../types/mitosis-component';
import { Plugin } from '../types/plugins';
export type { Plugin };
export declare const runPreJsonPlugins: ({ json, plugins, options, }: {
    json: MitosisComponent;
    plugins: Plugin[];
    options?: any;
}) => MitosisComponent;
export declare const runPostJsonPlugins: ({ json, plugins, options, }: {
    json: MitosisComponent;
    plugins: Plugin[];
    options?: any;
}) => MitosisComponent;
export declare const runPreCodePlugins: ({ code, plugins, options, json, }: {
    json: MitosisComponent;
    code: string;
    plugins: Plugin[];
    options?: any;
}) => string;
export declare const runPostCodePlugins: ({ code, plugins, options, json, }: {
    json: MitosisComponent;
    code: string;
    plugins: Plugin[];
    options?: any;
}) => string;
