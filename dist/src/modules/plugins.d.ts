import { MitosisComponent } from '../types/mitosis-component';
import { Plugin } from '../types/plugins';
export type { Plugin };
export declare const runPreJsonPlugins: (json: MitosisComponent, plugins: Plugin[], options?: any) => MitosisComponent;
export declare const runPostJsonPlugins: (json: MitosisComponent, plugins: Plugin[], options?: any) => MitosisComponent;
export declare const runPreCodePlugins: (code: string, plugins: Plugin[], options?: any) => string;
export declare const runPostCodePlugins: (code: string, plugins: Plugin[], options?: any) => string;
