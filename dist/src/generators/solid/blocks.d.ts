import { MitosisComponent } from '../../types/mitosis-component';
import { MitosisNode } from '../../types/mitosis-node';
import { ToSolidOptions } from './types';
export declare const blockToSolid: ({ json, options, component, }: {
    json: MitosisNode;
    options: ToSolidOptions;
    component: MitosisComponent;
}) => string;
