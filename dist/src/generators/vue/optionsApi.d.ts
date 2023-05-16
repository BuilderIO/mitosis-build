import { extendedHook, MitosisComponent } from '../../types/mitosis-component';
import { ToVueOptions } from './types';
export declare function generateOptionsApiScript(component: MitosisComponent, options: ToVueOptions, path: string | undefined, template: string, props: string[], onUpdateWithDeps: extendedHook[], onUpdateWithoutDeps: extendedHook[]): string;
