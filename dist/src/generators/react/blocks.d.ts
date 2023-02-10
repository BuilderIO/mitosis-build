import { MitosisComponent } from '../../types/mitosis-component';
import { MitosisNode } from '../../types/mitosis-node';
import { ToReactOptions } from './types';
export declare const blockToReact: (json: MitosisNode, options: ToReactOptions, component: MitosisComponent, parentSlots?: any[]) => string;
