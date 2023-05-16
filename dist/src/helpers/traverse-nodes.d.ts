import { TraverseContext } from 'traverse';
import { MitosisComponent } from '../types/mitosis-component';
import { MitosisNode } from '../types/mitosis-node';
export declare function traverseNodes(component: MitosisComponent | MitosisNode, cb: (node: MitosisNode, context: TraverseContext) => void): void;
