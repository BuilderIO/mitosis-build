import { extendedHook, MitosisComponent } from '../../types/mitosis-component';
import { ToVueOptions } from './types';
export declare function generateCompositionApiScript(component: MitosisComponent, options: ToVueOptions, template: string, props: Array<string>, onUpdateWithDeps: extendedHook[], onUpdateWithoutDeps: extendedHook[]): string;
