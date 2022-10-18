import { MitosisComponent, extendedHook } from '../../types/mitosis-component';
import { ToVueOptions } from './types';
export declare function appendValueToRefs(input: string, component: MitosisComponent, options: ToVueOptions): string;
export declare function generateCompositionApiScript(component: MitosisComponent, options: ToVueOptions, template: string, props: Array<string>, onUpdateWithDeps: extendedHook[], onUpdateWithoutDeps: extendedHook[]): string;
