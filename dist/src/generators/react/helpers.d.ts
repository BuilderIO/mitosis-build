import { MitosisComponent } from '../../types/mitosis-component';
import { MitosisNode } from '../../types/mitosis-node';
import { ToReactOptions } from './types';
export declare const processBinding: (str: string, options: ToReactOptions) => string;
export declare const openFrag: (options: ToReactOptions) => string;
export declare const closeFrag: (options: ToReactOptions) => string;
export declare function getFragment(type: 'open' | 'close', options: ToReactOptions): string;
export declare const wrapInFragment: (json: MitosisComponent | MitosisNode) => boolean;
