import { MitosisComponent } from '../types/mitosis-component';
import { MitosisNode } from '../types/mitosis-node';
import { TraverseContext } from 'traverse';
export declare function traverseNodes(component: MitosisComponent | MitosisNode, cb: (node: MitosisNode, context: TraverseContext) => void): void;
